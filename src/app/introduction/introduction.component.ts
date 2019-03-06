import { AfterViewInit, Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { CreateGeometryService } from '../service/create-geometry.service';
import { StatsHelperService } from '../service/stats-helper.service';
import { SceneService} from '../service/scene.service';
import { ControlsService } from '../service/controls.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'benjamin-introduction',
    templateUrl: './introduction.component.html'
})
export class IntroductionComponent implements AfterViewInit, OnDestroy {
    public assetPath: string = environment.assetsPath;
    public imgPath: string = environment.assetsPath + 'img/';
    public docPath: string = environment.assetsPath + 'doc/';
    public gui: dat.GUI = new dat.GUI();
    public controls: THREE.OrbitControls;

    public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    private scene: THREE.Scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();

    public octahedron: THREE.Mesh;
    public textEngineer: THREE.Mesh = new THREE.Mesh();
    readonly cameraPosition: any = {x : -41, y : 11, z : 55};
    readonly textPosition: any = {x : -20, y : -6, z : 0};
    public animationFrame: any;
    public control: THREE.OrbitControls;

    private radianX: number = 0;    
    private radianY: number = 0;

    @ViewChild('canvas') private canvasRef: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private createGeomtry: CreateGeometryService,
        private guiHelper: StatsHelperService,
        private sceneService: SceneService,
        private controlService: ControlsService
        ) {
        if(!environment.production){
            this.guiHelper.addStats(this.elementRef);
        }
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
        this.sceneService.createScene(this.scene, 0xd660d0);
        this.sceneService.createLight(this.scene, 0xffffff);
        this.sceneService.createCamera(this.camera, this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z, this.getAspectRatio());
        this.sceneService.createPlane(this.scene, 0x5b2158);
        this.sceneService.createText('UX Engineer', this.scene, this.textEngineer, 0xff4799, this.textPosition);
        this.createOctahedronGeometry();
        this.startRendering();
        this.addControls();
    }

    private addControls() {
        let scene = this.renderer.domElement;
        this.control = new THREE.OrbitControls(this.camera, scene);
        this.controlService.addControl(this.control);
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

    public createOctahedronGeometry(){
        this.octahedron = this.createGeomtry.setOctahedron(20);
        this.octahedron.forEach((octahedron: any) => {
            this.scene.add(octahedron);
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
    }

    ngOnDestroy(){
        console.log('Destoryed!!');
        this.destoryRender();
        this.createGeomtry.destoryGeometry(this.scene, this.octahedron);
        this.renderer = null;
        this.camera = null;
        this.octahedron = null;
        this.textEngineer = null;
        this.controlService.removeControl(this.control);
    }
}