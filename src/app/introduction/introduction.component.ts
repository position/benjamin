import { AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { CreateGeometryService } from '../service/create-geometry.service';
import { StatsHelperService } from '../service/stats-helper.service';
import { ControlsService} from '../service/controls.service';
import { SceneService} from '../service/scene.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'benjamin-introduction',
    templateUrl: './introduction.component.html'
})
export class IntroductionComponent implements AfterViewInit, OnDestroy {
    public assetPath: string = environment.assetsPath;
    public imgPath: string = environment.assetsPath + 'img/';
    public docPath: string = environment.assetsPath + 'doc/';
    public gui: dat.GUI = !environment.production ? new dat.GUI() : null;

    public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    private scene: THREE.Scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();

    public octahedron: THREE.Mesh;
    public textEngineer: THREE.Mesh = new THREE.Mesh();
    public dust: THREE.Mesh;
    public cameraPosition: any = {x : -41, y : 11, z : 55};
    readonly textPosition: Object = {x : -20, y : -6, z : 0};
    public animationFrame: any;

    private radianX: number = 0;    
    private radianY: number = 0;

    @ViewChild('canvas') private canvasRef: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private viewContainer: ViewContainerRef,
        private createGeometry: CreateGeometryService,
        private guiHelper: StatsHelperService,
        
        private controls: ControlsService,
        private sceneService: SceneService
        ) {
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
        this.sceneService.createScene(this.scene, 0xd660d0);
        this.sceneService.createLight(this.scene, 0xffffff);
        this.sceneService.createCamera(this.camera, this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z, this.getAspectRatio());
        this.sceneService.createPlane(this.scene, 0x5b2158);
        this.sceneService.createText('UX Engineer', this.scene, this.textEngineer, 0xff4799, this.textPosition);
        //this.sceneService.createGeometrys(this.scene, this.octahedron, 20, 'octahedron');
        this.createOctahedronGeometry();
        this.startRendering();
        this.addControls();

        if(!environment.production){
            this.guiHelper.addStats(this.elementRef);
        }
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
        this.animationOctahedronGeometry();
        
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

    public createOctahedronGeometry(){
        this.octahedron = this.createGeometry.getOctahedron(20);
        this.octahedron.forEach((octahedron: any) => {
            this.scene.add(octahedron);
        });

        this.dust = this.createGeometry.getDustParticle(500);
        this.dust.forEach((dust: any) => {
            this.scene.add(dust);
        });
    }
    
    public animationOctahedronGeometry(){
        const radius = 3;
        
        this.radianX += 0.003;
        this.radianY += 0.003;
        this.octahedron.forEach((cube: any, index: number) => {
            let idx: number = (index + 1) * 0.5;
            //cube.rotation.x += 0.05;
            cube.rotation.y += 0.05;
            //cube.rotation.z += 0.05;
            cube.position.x = Math.cos(this.radianX * idx) * radius * (index + 1);
            //cube.position.y = Math.cos(this.radianX) * radius;
            cube.position.z = Math.sin(this.radianY * idx) * radius * (index + 1);
            
        });

        if(this.textEngineer){
            if(this.textEngineer.position.y < 3){
                this.textEngineer.position.y += 0.05;
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

    ngOnDestroy(){
        console.log('Destoryed!!');
        this.destoryRender();
        this.createGeometry.destoryGeometry(this.scene, this.octahedron);
        this.createGeometry.destoryGeometry(this.scene, this.dust);
        this.renderer = null;
        this.camera = null;
        this.octahedron = null;
        this.textEngineer = null;
        this.dust = null;
    }
}