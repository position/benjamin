import { AfterViewInit, Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { CreateGeometryService } from '../service/create-geometry.service';
import { StatsHelperService } from '../service/stats-helper.service';
import { SceneService } from '../service/scene.service';
import { ControlsService } from '../service/controls.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'benjamin-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements AfterViewInit, OnDestroy {
    public gui: dat.GUI = new dat.GUI();

    public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    private scene: THREE.Scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();

    public sphere: THREE.Mesh;
    public textBenjamin: THREE.Mesh = new THREE.Mesh();
    readonly cameraPosition: any = {x: 20, y: 30, z: 60};
    readonly textPosition: any = {x: -15, y: -6, z: 0};
    public dust: THREE.Mesh;
    public animationFrame: any;
    public control: THREE.OrbitControls;

    private radianX: number = 0;
    private radianY: number = 0;

    @ViewChild('canvas') private canvasRef: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private createGeometry: CreateGeometryService,
        private guiHelper: StatsHelperService,
        private sceneService: SceneService,
        private controlService: ControlsService
    ) {
        if (!environment.production) {
            this.guiHelper.addStats(this.elementRef);
        }
    }

    /* LIFECYCLE */
    public async ngAfterViewInit() {
        this.sceneService.createScene(this.scene, 0x2b2f26);
        this.sceneService.createLight(this.scene, 0xffffff);
        this.sceneService.createCamera(this.camera, this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z, this.getAspectRatio());
        await this.sceneService.createPlane(this.scene, 0x2b2f26);
        await this.sceneService.createText('Benjamin', this.scene, this.textBenjamin, 0xfff600, this.textPosition);
        this.createSphereGeometry();
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
        this.animationSphereGeometry();

        this.guiHelper.updateStats();
    };

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

    public createSphereGeometry() {
        this.sphere = this.createGeometry.getSphere(20);
        this.sphere.forEach((cube: any) => {
            this.scene.add(cube);
        });

        this.dust = this.createGeometry.getDustParticle(500);
        this.dust.forEach((dust: any) => {
            this.scene.add(dust);
        });
    }

    public animationSphereGeometry() {
        const radius = 3;
        this.radianX += 0.003;
        this.radianY += 0.003;
        this.sphere.forEach((cube: any, index: number) => {
            const idx: number = (index + 1) * 0.5;
            cube.rotation.y += 0.05;
            cube.position.x = Math.cos(this.radianX * idx) * radius * (index + 1);
            cube.position.z = Math.sin(this.radianY * idx) * radius * (index + 1);
        });

        if (this.textBenjamin) {
            if (this.textBenjamin.position.y < 3) {
                this.textBenjamin.position.y += 0.05;
            }
        }

        this.dust.forEach(dust => {
            dust.rotation.x += 0.05;
            dust.rotation.y += 0.05;
            dust.rotation.z += 0.05;
            dust.material.opacity = 1;

            if (dust.position.y < 30) {
                dust.position.y += 0.05;
            } else {
                dust.material.opacity = 0;
            }
        });
    }

    public ngOnDestroy() {
        console.log('Destoryed!!');

        this.destroyRender();
        this.createGeometry.destroyGeometry(this.scene, this.sphere);
        this.createGeometry.destroyGeometry(this.scene, this.dust);
        this.renderer = null;
        this.camera = null;
        this.sphere = null;
        this.textBenjamin = null;
        this.controlService.removeControl(this.control);
        this.dust = null;
    }
}
