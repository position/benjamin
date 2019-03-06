import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { StatsHelperService } from '../service/stats-helper.service';
import { SceneService} from '../service/scene.service';
import { ControlsService } from '../service/controls.service';
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
	readonly cameraPosition: any = {x : 0, y : 3, z : 40};
	public animationFrame: any;

	@ViewChild('canvas') private canvasRef: ElementRef;
	
	constructor(
		private elementRef: ElementRef,
        private guiHelper: StatsHelperService,
		private sceneService: SceneService,
		private controlService: ControlsService
	) { 
		if(!environment.production){
            this.guiHelper.addStats(this.elementRef);
        }
	}

	ngAfterViewInit(){
		this.sceneService.createScene(this.scene, 0xffffff);
        this.sceneService.createLight(this.scene, 0xffffff);
        this.sceneService.createCamera(this.camera, this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z, this.getAspectRatio());
		this.sceneService.createPlane(this.scene, 0x2c2d23);
		
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
        //this.animationBoxGeometry();
        
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
	
	ngOnDestroy(){
		console.log('Destoryed!!');
		this.destoryRender();
		this.renderer = null;
		this.camera = null;
		this.controlService.removeControl(this.control);
	}
}

