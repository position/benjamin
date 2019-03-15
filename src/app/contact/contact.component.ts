import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { CreateGeometryService } from '../service/create-geometry.service';
import { StatsHelperService } from '../service/stats-helper.service';
import { SceneService} from '../service/scene.service';
import { ControlsService } from '../service/controls.service';
import { ModelLoaderService} from '../service/model-loader.service';
import { environment } from '../../environments/environment';
import "../../assets/js/form-submission-handler.js";

@Component({
	selector: 'benjamin-contact',
	templateUrl: './contact.component.html'
})
export class ContactComponent implements AfterViewInit, OnDestroy {
	public gui: dat.GUI = new dat.GUI();
	public control: THREE.OrbitControls;
    public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    private scene: THREE.Scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
    public email: THREE.Mesh;
    public airPlane: THREE.Group;
	readonly cameraPosition: any = {x : 0, y : 15, z : 40};
    public animationFrame: any;
    private objLoader = new THREE.OBJLoader();
    public manager: THREE.LoadingManager;

	@ViewChild('canvas') private canvasRef: ElementRef;
	
	constructor(
        private elementRef: ElementRef,
        private createGeometry: CreateGeometryService,
        private guiHelper: StatsHelperService,
		private sceneService: SceneService,
        private controlService: ControlsService,
        private modelLoaderService : ModelLoaderService
	) { 
		if(!environment.production){
            this.guiHelper.addStats(this.elementRef);
        }
	}

	ngAfterViewInit(){
		this.sceneService.createScene(this.scene, 0x000000);
        this.sceneService.createLight(this.scene, 0xffffff);
        this.sceneService.createCamera(this.camera, this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z, this.getAspectRatio());
        this.sceneService.createPlane(this.scene, 0x2c2d23);
        
        this.createPaperAirplane();
		this.createMailGeometry();
		this.startRendering();
		this.addControls();
    //    this.objLoader.load('./assets/models/paper_airplane.obj', this.onModelLoadingCompleted, (xhr)=>{ console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ); });
    }
    private onModelLoadingCompleted = (model) => {
        console.log('model', model);
        model.position.set(0, 5, 0);
        model.scale.x = 10;
        model.scale.y = 10;
        model.scale.z = 10;

        this.scene.add(model);
        
        this.render();
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
        this.animationMailGeometry();
        
        this.guiHelper.updateStats();
    }

    public async createPaperAirplane(){
        let airPlanes = [];
        this.airPlane = await this.modelLoaderService.objLoad('paper_airplane');
        for(let i = 0; i < 100; i++){
            this.airPlane.scale.x = 30;
            this.airPlane.scale.y = 30;
            this.airPlane.scale.z = 30;
            this.airPlane.rotation.y = Math.PI;
            this.airPlane.position.set(0, 5, 0);
            airPlanes.push(this.airPlane);
        }
        airPlanes.forEach((item: any) => {
            this.scene.add(item);
        });
        
    }

    public createMailGeometry(){
        this.email = this.createGeometry.getPlaneParticle(300);
        this.email.forEach((email: any) => {
            this.scene.add(email);
        });
    }

    public animationMailGeometry(){
        this.email.forEach((email: any) => {
            email.rotation.x = -Math.PI / 2;
            email.position.z += 0.1;
        });
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
	
	ngOnDestroy(){
		console.log('Destoryed!!');
		this.destoryRender();
		this.renderer = null;
        this.camera = null;
        this.email = null;
		this.controlService.removeControl(this.control);
	}
}

