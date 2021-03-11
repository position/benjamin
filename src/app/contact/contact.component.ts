import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { CreateGeometryService } from '../service/create-geometry.service';
import { StatsHelperService } from '../service/stats-helper.service';
import { SceneService} from '../service/scene.service';
import { ControlsService } from '../service/controls.service';
import { ModelLoaderService} from '../service/model-loader.service';
import { environment } from '../../environments/environment';
import '../../assets/js/form-submission-handler.js';

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
    readonly cameraPosition: any = {x: 0, y: 15, z: 40};
    public animationFrame: any;
    public manager: THREE.LoadingManager;

    @ViewChild('canvas') private canvasRef: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private createGeometry: CreateGeometryService,
        private guiHelper: StatsHelperService,
        private sceneService: SceneService,
        private controlService: ControlsService,
        private modelLoaderService: ModelLoaderService
    ) {
        if (!environment.production) {
            this.guiHelper.addStats(this.elementRef);
        }
    }

    public async ngAfterViewInit() {
        this.sceneService.createScene(this.scene, 0x000000);
        this.sceneService.createLight(this.scene, 0xffffff);
        this.sceneService.createCamera(this.camera, this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z, this.getAspectRatio());
        await this.sceneService.createPlane(this.scene, 0x2c2d23);
        this.createMailGeometry();
        this.startRendering();
        this.addControls();
    }

    private addControls() {
        const scene = this.renderer.domElement;
        this.control = new THREE.OrbitControls(this.camera, scene);
        this.controlService.addControl(this.control);
    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private getAspectRatio(): number {
        const height = this.canvas.clientHeight;
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

    public async createPaperAirplane() {
        this.airPlane = await this.modelLoaderService.objLoad('paper_airplane');

        this.airPlane.scale.x = 30;
        this.airPlane.scale.y = 30;
        this.airPlane.scale.z = 30;
        this.airPlane.rotation.y = Math.PI;
        this.airPlane.position.set(0, 5, 0);

        this.scene.add(this.airPlane);
    }

    public createMailGeometry() {
        this.email = this.createGeometry.getPlaneParticle(100);
        this.email.forEach((email: any) => {
            this.scene.add(email);
        });
    }

    public animationMailGeometry() {
        this.email.forEach((email: any) => {
            email.rotation.x = -Math.PI / 2;
            email.position.z += 0.3;
            email.material.opacity = 1;
            if (email.position.z > 50) {
                email.position.z = -50;
                email.material.opacity = 0;
            }
        });
    }

    public destroyRender() {
        window.cancelAnimationFrame(this.animationFrame);

        for (let index = this.scene.children.length - 1; index > 0; index--) {
            const removeTarget = this.scene.children[index];
            if (removeTarget instanceof THREE.Mesh) {
                this.scene.remove(removeTarget);
                removeTarget.geometry.dispose();
                removeTarget.material.dispose();
            }
        }
    }

    public ngOnDestroy() {
        console.log('Destroyed!!');

        this.destroyRender();
        this.renderer = null;
        this.camera = null;
        this.email = null;
        this.controlService.removeControl(this.control);
    }
}

