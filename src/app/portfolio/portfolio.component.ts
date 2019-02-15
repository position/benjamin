import { AfterViewInit, Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { CreateGeometryService } from '../service/create-geometry.service';
import { StatsHelperService } from '../service/stats-helper.service';
import { SceneService} from '../service/scene.service';
import { ControlsService} from '../service/controls.service';
import { SwiperConfigInterface, SwiperAutoplayInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { PortfolioData } from '../interface/portfolio';
import { PortfolioLists } from './portfolio-lists';
import { environment } from '../../environments/environment';

@Component({
    selector: 'benjamin-portfolio',
    templateUrl: './portfolio.component.html'
})
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
    public gui: dat.GUI = !environment.production ? new dat.GUI() : null;

    public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    private scene: THREE.Scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
    
    public box: THREE.Mesh;
    public textWork: THREE.Mesh = new THREE.Mesh();
    public dust: THREE.Mesh;
    public cameraPosition: any = {x : -33, y : 1, z : 33};
    readonly textPosition: Object = {x : -11, y : -6, z : 0};
    public animationFrame: any;

    private radianX: number = 0;    
    private radianY: number = 0;

    @ViewChild('canvas') private canvasRef: ElementRef;
    @ViewChild('portfolioSwipe') portfolioSwiper: SwiperComponent;
    readonly portfolioSwipeConifg: SwiperConfigInterface = {
        width: 300,
        spaceBetween: 0,
        freeMode: true,
        preloadImages: false,
        lazy: { loadPrevNext : true, loadPrevNextAmount : 5 },
        //updateOnImagesReady: true,
        autoplay: <SwiperAutoplayInterface>{
            disableOnInteraction: false
        }
    };
    public portfolioLists: Array<PortfolioData>;
    public assetPath: string = environment.assetsPath;
    public imgPath: string = environment.assetsPath + 'img/';
    
    constructor(
        private elementRef: ElementRef,
        private viewContainer: ViewContainerRef,
        private createGeometry: CreateGeometryService,
        private guiHelper: StatsHelperService,
        private controls: ControlsService,
        private sceneService: SceneService
    ) { 
        if(!environment.production){
            this.guiHelper.addStats(this.elementRef);
        }
    }

    ngOnInit() {
        this.portfolioLists = PortfolioLists;
    }

    ngAfterViewInit(){
        this.sceneService.createScene(this.scene, 0x262f99);
        this.sceneService.createLight(this.scene, 0xffffff);
        this.sceneService.createCamera(this.camera, this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z, this.getAspectRatio());
        this.sceneService.createPlane(this.scene, 0x151b60);
        this.sceneService.createText('Work', this.scene, this.textWork, 0x11e3ff, this.textPosition);
        //this.sceneService.createGeometrys(this.scene, this.box, 20, 'box');
        this.createBoxGeometry();
        this.startRendering();
        this.addControls();
    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private getAspectRatio(): number {
        let height = this.canvas.clientHeight;
        if (height === 0) {
            return 0;
        }
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    private startRendering() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            autoClear: true
        });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.autoClear = true;
        
        this.render();
    }

    public render = () => {
        this.renderer.render(this.scene, this.camera);
        this.animationFrame = requestAnimationFrame(this.render);
        this.camera.updateProjectionMatrix();
        this.animationBoxGeometry();
        
        this.guiHelper.updateStats();
    }

    public destoryRender(){
        window.cancelAnimationFrame(this.animationFrame);

        for(let index = this.scene.children.length -1; index > 0; index--) {
            let removeTarget = this.scene.children[index];
            if (removeTarget instanceof THREE.Mesh) {
                this.scene.remove(removeTarget);            
                removeTarget.geometry.dispose();
                removeTarget.material.dispose();
            }
        }
    }

    public addControls() {
        let scene = this.viewContainer.element.nativeElement;
        this.controls.addControl(this.controls, scene, this.camera);
    }

    public createBoxGeometry(){
        this.box = this.createGeometry.getBoxs(20);
        this.box.forEach((box: any) => {
            this.scene.add(box);
        });

        this.dust = this.createGeometry.getDustParticle(500);
        this.dust.forEach((dust: any) => {
            this.scene.add(dust);
        });
    }
    
    public animationBoxGeometry = () => {
        const radius = 3;
        
        this.radianX += 0.003;
        this.radianY += 0.003;
        this.box.forEach((cube: any, index: number) => {
            let idx: number = (index + 1) * 0.5;
            //cube.rotation.x += 0.05;
            cube.rotation.y += 0.05;
            //cube.rotation.z += 0.05;
            cube.position.x = Math.cos(this.radianX * idx) * radius * (index + 1);
            //cube.position.y = Math.cos(this.radianX) * radius;
            cube.position.z = Math.sin(this.radianY * idx) * radius * (index + 1);
            
        });
        if(this.textWork){
            if(this.textWork.position.y < 5){
                this.textWork.position.y += 0.05;
            }
        }

        this.dust.forEach((dust: any, index: number) => {
            dust.rotation.x += 0.05;
            dust.rotation.y += 0.05;
            dust.rotation.z += 0.05;
            dust.material.opacity = 1;

            if(dust.position.y < 30){
                dust.position.y += 0.05;
                dust.material.opacity -= 0.1;
            }
        });
    }

    public onLinkProject(link: string){
        window.open(link, "_blank");
    }

    ngOnDestroy(){
        console.log('Destoryed!!');
        this.destoryRender();
        this.createGeometry.destoryGeometry(this.scene, this.box);
        this.renderer = null;
        this.camera = null;
        this.box = null;
        this.textWork = null;
        this.dust = null;
    }
}
