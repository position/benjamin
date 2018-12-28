import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener, ViewContainerRef, NgZone, ChangeDetectorRef } from '@angular/core';
import * as THREE from 'three-full';
import * as Stats from 'stats.js';
import * as dat from 'dat.gui';

import { CreateGeomtryService } from '../service/create-geomtry.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'scene',
    templateUrl: './scene.component.html'
})
export class SceneComponent implements AfterViewInit {

    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;

    public fieldOfView: number = 50;
    public nearClippingPane: number = 1;    
    public farClippingPane: number = 1100;

    public controls: THREE.OrbitControls;
    public sphere: THREE.Mesh;
    public orange: THREE.Mesh;
    public trophy: THREE.Mesh;
    public animationFrame: any;
    public stats: Stats;
    public gui: dat.GUI;
    private textLoader = new THREE.FontLoader();
    // private loadingManager = new THREE.LoadingManager();
    // private daeLoader = new THREE.ColladaLoader();
    // private objLoader = new THREE.OBJLoader();
    // private textureLoader = new THREE.TextureLoader();
    // private imageLoader = new THREE.ImageLoader();
    // private texture = new THREE.Texture;

    private radianX: number = 0;    
    private radianY: number = 0;

    @ViewChild('canvas') private canvasRef: ElementRef;

    public assetPath: string = environment.assetsPath;
    public fontPath: string = environment.assetsPath + 'fonts/';

    @Input() set routePath(path: string) {
        if(path){
            console.log(path);
            switch (path){
                case 'profile':
                    console.log(1);
                    break;
                case 'introduction':
                    console.log(2);
                    break;
                case 'portfolio':
                    console.log(3);
                    break;
    
                default:
                    console.error('nothing path!!!');
            }
        }
    }

    constructor(
        private elementRef: ElementRef,
        private viewContainer: ViewContainerRef,
        private createGeomtry: CreateGeomtryService,
        private zone: NgZone,
        private cd: ChangeDetectorRef,
        ) {
        this.stats = new Stats();
        //this.elementRef.nativeElement.appendChild(this.stats.dom);
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
        this.createScene();
        this.createLight();
        this.createCamera();
        this.createText();
        this.createPlane();
        this.createSphereGeometry();
        this.startRendering();
        this.addControls();
        //this.setGui();
    }
    
    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private createScene() {
        const grid = new THREE.GridHelper(100, 50);
        const axes = new THREE.AxesHelper(200);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xbdd0a2);
        //this.scene.fog = new THREE.FogExp2(0x4f6134, 0.005);
        //this.scene.add(grid);
        this.scene.add(axes);
        
        this.onCreateSphere();
    }

    private onCreateSphere(){
        let material_univ = new THREE.MeshLambertMaterial({
            color: 0xbdd0a2,
            side: THREE.BackSide
        });
        let geometry_univ = new THREE.SphereGeometry(60, 32, 32);
        let mesh = new THREE.Mesh(geometry_univ, material_univ);
        
        this.scene.add(mesh);
    }

    private createPlane(){
        let geometry = new THREE.PlaneGeometry(120, 120, 0);
        let material = new THREE.MeshLambertMaterial({ color: 0x2b2f26, side: THREE.DoubleSide });
        let plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(0, 0, 0);
        this.scene.add(plane);
    }

    private createText(){
        this.textLoader.load(this.fontPath + 'droid_serif_regular.typeface.json', (font: any) => {
            const textGeometry = new THREE.TextGeometry('Benjamin', {
                font: font,
                size: 5,
                height: 1,
                curveSegment: 12,
                bevelEnabled: false,
                side: THREE.DoubleSide
            });
            textGeometry.translate(-15, 3, 0);

            const material = new THREE.MeshPhongMaterial({ 
                color: 0xfff600,
                specular: 0xffffff,
                shininess: 30
            });
            const text = new THREE.Mesh(textGeometry, material);
            this.scene.add(text);
        });
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
        //spotLight.castShadow = true;
        //spotLight.penumbra = 0;
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
        this.camera.position.set(20, 30, 60);
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
        //this.animationSphereGeometry();
        this.stats.update();
        this.camera.updateProjectionMatrix();
    }

    public addControls() {
        let scene = this.viewContainer.element.nativeElement;
        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.enableZoom = false;
        this.controls.domElement = scene;

        this.zone.run(() => { this.cd.markForCheck(); });
    }

    public createSphereGeometry(){
        this.sphere = this.createGeomtry.setSphere(20);
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
    
    /* EVENTS */
    public onMouseDown(event: MouseEvent) {
        //console.log("onMouseDown");
        event.preventDefault();

        // Example of mesh selection/pick:
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);

        let obj: THREE.Object3D[] = [];
        this.findAllObjects(obj, this.scene);
        const intersects = raycaster.intersectObjects(obj);
        //console.log("Scene has " + obj.length + " objects");
        //console.log(intersects.length + " intersected objects found")
        intersects.forEach((i) => {
            //console.log(i.object); // do what you want to do with object
        });
    }

    private findAllObjects(pred: THREE.Object3D[], parent: THREE.Object3D) {
        // NOTE: Better to keep separate array of selected objects
        if (parent.children.length > 0) {
            parent.children.forEach((i) => {
                pred.push(i);
                this.findAllObjects(pred, i);                
            });
        }
    }

    public onMouseUp(event: MouseEvent) {
        //console.log("onMouseUp");
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

    @HostListener('document:keypress', ['$event'])
    public onKeyPress(event: KeyboardEvent) {
        //console.log("onKeyPress: " + event.key);
    }
}