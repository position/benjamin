import { AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { CreateGeomtryService } from '../service/create-geomtry.service';
import { StatsHelperService } from '../service/stats-helper.service';
import { FontLoaderService} from '../service/font-loader.service';
import { ControlsService} from '../service/controls.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'benjamin-introduction',
    templateUrl: './introduction.component.html'
})
export class IntroductionComponent implements AfterViewInit, OnDestroy {
    public assetPath: string = environment.assetsPath;
    public imgPath: string = environment.assetsPath + 'img/';
    public docPath: string = environment.assetsPath + 'doc/';
    public gui: dat.GUI;

    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;

    public fieldOfView: number = 50;
    public nearClippingPane: number = 1;    
    public farClippingPane: number = 1100;

    public octahedron: THREE.Mesh;
    public textEngineer: THREE.Mesh;
    public animationFrame: any;

    private radianX: number = 0;    
    private radianY: number = 0;

    @ViewChild('canvas') private canvasRef: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private viewContainer: ViewContainerRef,
        private createGeomtry: CreateGeomtryService,
        private guiHelper: StatsHelperService,
        private fontLoader: FontLoaderService,
        private controls: ControlsService
        ) {
        if(!environment.production){
            this.guiHelper.addStats(this.elementRef);
        }
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
        this.createScene();
        this.createLight();
        this.createCamera();
        this.createText();
        this.createOctahedronGeometry();
        this.startRendering();
        this.addControls();

        if(!environment.production){
            this.setGui();
        }
    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xd660d0);
        this.onCreateSphere();
        this.createPlane();
        if(!environment.production){
            const grid = new THREE.GridHelper(100, 50);
            const axes = new THREE.AxesHelper(200);
            //this.scene.add(grid);
            this.scene.add(axes);
        }
    }

    private onCreateSphere(){
        let material_univ = new THREE.MeshLambertMaterial({
            color: 0xd660d0,
            side: THREE.BackSide
        });
        let geometry_univ = new THREE.SphereGeometry(60, 32, 32);
        let mesh = new THREE.Mesh(geometry_univ, material_univ);
        
        this.scene.add(mesh);
    }

    private createPlane(){
        let geometry = new THREE.PlaneGeometry(120, 120, 0);
        let material = new THREE.MeshStandardMaterial({ color: 0x5b2158, side: THREE.DoubleSide });
        let plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(0, 0, 0);
        this.scene.add(plane);
    }

    private async createText(): Promise<void>{
        let response = await this.fontLoader.onFontLoader();
        const textGeometry = new THREE.TextGeometry('UX Engineer', {
            font: response,
            size: 5,
            height: 1,
            curveSegment: 12,
            bevelEnabled: false,
            side: THREE.DoubleSide
        });
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xff4799,
            specular: 0xffffff,
            shininess: 30
        });
        this.textEngineer = new THREE.Mesh(textGeometry, material);
        this.textEngineer.position.set(-15, -6, 0);
        this.scene.add(this.textEngineer);
    }

    private createLight() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        const lightHelper = new THREE.DirectionalLightHelper( light, 15 );
        light.position.set(-30, 50, 50);
        light.angle = Math.PI / 5;
        this.scene.add(light);
        this.scene.add(lightHelper);

        const spotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI / 4, 1);
        const spotLightHelper = new THREE.SpotLightHelper( spotLight, 1 );
        spotLight.position.set(0, 30, 0);
        //this.scene.add(spotLight);
        //this.scene.add(spotLightHelper);
    }

    private createCamera() {
        let aspectRatio = this.getAspectRatio();
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );
        // Set position and look at
        this.camera.position.set(-41, 11, 55);
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
            antialias: true
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
        while(this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }
    }

    public addControls() {
        let scene = this.viewContainer.element.nativeElement;
        this.controls.addControl(this.controls, scene, this.camera);
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

    public setGui(){
        this.gui = new dat.GUI();
        let options = {
            reset : () => {
                console.log('reset click');
                this.camera.position.x = 20;
                this.camera.position.y = 30;
                this.camera.position.z = 60;
            }   
        };
        let cam = this.gui.addFolder('Camera');
        cam.add(this.camera.position, 'x', -200, 200, 1).listen();
        cam.add(this.camera.position, 'y', -200, 200, 1).listen();
        cam.add(this.camera.position, 'z', -200, 200, 1).listen();
        cam.add(this.camera, 'fov', 1, 150).listen();
        
        cam.open();

        this.gui.add(options, 'reset');
    }
    
    @HostListener('window:resize', ['$event'])
    public onResize(event: Event) {
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        //console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
 
    ngOnDestroy(){
        console.log('Destoryed!!');
        this.destoryRender();
        if(!environment.production){
            this.gui.destroy();
        }
    }
}