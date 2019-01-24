import { AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { CreateGeometryService } from '../service/create-geometry.service';
import { StatsHelperService } from '../service/stats-helper.service';
import { ControlsService} from '../service/controls.service';
import { SceneService} from '../service/scene.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'benjamin-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements AfterViewInit, OnDestroy {
    public gui: dat.GUI = !environment.production ? new dat.GUI() : null;
    public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    private scene: THREE.Scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();

    public sphere: THREE.Mesh;
    public textBenjamin: THREE.Mesh = new THREE.Mesh();
    readonly textPosition: Object = {x : -15, y : -6, z : 0};
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
        if(!environment.production){
            this.guiHelper.addStats(this.elementRef);
        }
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
        this.sceneService.createScene(this.scene, 0x2b2f26);
        this.sceneService.createLight(this.scene, 0xffffff);
        this.sceneService.createCamera(this.camera, 20, 30, 60, this.getAspectRatio());
        this.sceneService.createPlane(this.scene, 0x2b2f26);
        this.sceneService.createText('Benjamin', this.scene, this.textBenjamin, 0xfff600, this.textPosition);
        //this.sceneService.createGeometrys(this.scene, this.sphere, 20, 'sphere');
        this.createSphereGeometry();
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
        this.animationSphereGeometry();
        
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

    public createSphereGeometry(){
        this.sphere = this.createGeometry.setSphere(20);
        this.sphere.forEach((cube: any) => {
            this.scene.add(cube);
        });
    }
    
    public animationSphereGeometry(){
        const radius = 3;
        
        this.radianX += 0.003;
        this.radianY += 0.003;
        this.sphere.forEach((cube: any, index: number) => {
            let idx: number = (index + 1) * 0.5;
            //cube.rotation.x += 0.05;
            cube.rotation.y += 0.05;
            //cube.rotation.z += 0.05;
            cube.position.x = Math.cos(this.radianX * idx) * radius * (index + 1);
            //cube.position.y = Math.cos(this.radianX) * radius;
            cube.position.z = Math.sin(this.radianY * idx) * radius * (index + 1);
            
        });
        if(this.textBenjamin){
            if(this.textBenjamin.position.y < 3){
                this.textBenjamin.position.y += 0.05;
            }
        }
    }
    
    ngOnDestroy(){
        console.log('Destoryed!!');
        this.destoryRender();
        this.createGeometry.destoryGeometry(this.scene, this.sphere);
        this.renderer = null;
        this.camera = null;
        this.sphere = null;
        this.textBenjamin = null;
    }
}