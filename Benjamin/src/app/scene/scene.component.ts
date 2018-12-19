import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three-full';
import * as Stats from 'stats.js';
import * as dat from 'dat.gui';
import { Fog } from 'three';

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
    public cube: THREE.Mesh;
    public orange: THREE.Mesh;
    public trophy: THREE.Mesh;
    public animationFrame: any;
    public stats: Stats;
    public gui: dat.GUI;
    
    private loadingManager = new THREE.LoadingManager();
    private daeLoader = new THREE.ColladaLoader();
    private objLoader = new THREE.OBJLoader();
    private textureLoader = new THREE.TextureLoader();	
    private imageLoader = new THREE.ImageLoader();
    private textLoader = new THREE.FontLoader();
    private texture = new THREE.Texture;

    private radianX: number = 0;    
    private radianY: number = 0;

    @ViewChild('canvas') private canvasRef: ElementRef;

    constructor(
        private elementRef: ElementRef,
        ) {
        this.stats = new Stats();
        this.elementRef.nativeElement.appendChild(this.stats.dom);
        
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
        this.createScene();
        this.createLight();
        this.createCamera();
        this.createText();
        this.createPlane();
        this.createBoxGeometry();
        this.startRendering();
        this.addControls();
        this.setGui();
    }
    
    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private createScene() {
        const grid = new THREE.GridHelper(100, 50);
        const axes = new THREE.AxesHelper(200);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xbdd0a2);
        this.scene.fog = new THREE.FogExp2(0x4f6134, 0.005);
        
        //this.scene.add(grid);
        this.scene.add(axes);
        
        
        this.imageLoader.load("./assets/img/wood.jpg", (data) => {
            this.texture.image = data;
            this.texture.needsUpdate = true;
        });

        this.imageLoader.load("./assets/img/metal.jpg", (data) => {
            this.texture.image = data;
            this.texture.needsUpdate = true;
        });

        this.onTextureLoadingCompleted();
    }

    private onTextureLoadingCompleted(){
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
        this.textLoader.load('./assets/fonts/droid_serif_regular.typeface.json', (font) => {
            const textGeometry = new THREE.TextGeometry('Benjamin', {
                font: font,
                size: 8,
                height: 1,
                curveSegment: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 1,
                bevelSegments: 5
            });
            const material = new THREE.MeshLambertMaterial({ color: 0x2b2f26, side: THREE.DoubleSide });
            const text = new THREE.Mesh(textGeometry, material);

            this.scene.add(text);
        });
    }

    private createLight() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        const lightHelper = new THREE.DirectionalLightHelper( light, 15 );
        light.position.set(-50, 50, 50);
        light.angle = Math.PI / 5;
        this.scene.add(light);
        this.scene.add(lightHelper);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        const spotLightHelper = new THREE.SpotLightHelper( spotLight, 1 );
        spotLight.position.set(50, 50, -30);
        spotLight.castShadow = true;
        spotLight.angle = Math.PI / 12;
        spotLight.penumbra = 0;
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
        this.animationBoxGeometry();
        this.stats.update();
        this.camera.updateProjectionMatrix();
    }

    public addControls() {
        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        //this.controls.addEventListener('change', this.render);
    }

    public createBoxGeometry(){
        let boxGeometrys = new CreateGeometrys(20);
        //this.cube = boxGeometrys.setBoxs();
        this.cube = boxGeometrys.setSphere();
        this.cube.forEach((cube: any) => {
            this.scene.add(cube);
        });
    }

    public animationBoxGeometry(){
        const radius = 3;
        
        this.radianX += 0.003;
        this.radianY += 0.003;
        this.cube.forEach((cube: any, index: number) => {
            //cube.rotation.x += 0.05;
            cube.rotation.y += 0.05;
            //cube.rotation.z += 0.05;
            cube.position.x = Math.cos(this.radianX * index + 1) * radius * (index + 1);
            //cube.position.y = Math.cos(this.radianX) * radius;
            cube.position.z = Math.sin(this.radianY * index + 1) * radius * (index + 1);
            
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
                //this.cube.position.x = 0;
                //this.cube.position.y = 0;
                //this.cube.position.z = 0;
            }   
        };
        let cam = this.gui.addFolder('Camera');
        //let boxCube = this.gui.addFolder('Cube');
        // boxCube.add(this.cube.position, 'x', -200, 200, 1).listen();
        // boxCube.add(this.cube.position, 'y', -200, 200, 1).listen();
        // boxCube.add(this.cube.position, 'z', -200, 200, 1).listen();
        // boxCube.open();
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


class CreateGeometrys{
    public camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;
    public mesh: THREE.Mesh;
    public geometry = new THREE.BoxGeometry(1, 1, 1);
    public sphere = THREE.SphereGeometry;
    public meterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

    constructor(private boxIndex: number){
    }

    public setBoxs(){
        let cubes = [];
        for(let i = 0; i < this.boxIndex; i++){
            this.meterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });    
            this.mesh = new THREE.Mesh(this.geometry, this.meterial);
            this.mesh.position.x = Math.random() * 50 - i;
            this.mesh.position.y = Math.random() * 50 - i;
            this.mesh.position.z = Math.random() * 50 - i;
            this.mesh.scale.x = Math.random() + 0.5;
            this.mesh.scale.y = Math.random() + 0.5;
            this.mesh.scale.z = Math.random() + 0.5;
            cubes.push(this.mesh);
        }
        return cubes;
    }

    public setSphere(){
        let spheres = [];
        for(let i = 0; i < this.boxIndex; i++){
            let radius = Math.random() * 1;
            this.sphere = new THREE.SphereGeometry(radius, 30, 30);
            this.meterial = new THREE.MeshLambertMaterial({ color: 0xbad790 });
            
            this.mesh = new THREE.Mesh(this.sphere, this.meterial);
            this.mesh.position.x = Math.random() * 50;
            this.mesh.position.y = Math.random() * 50 + 0.5;
            this.mesh.position.z = Math.random() * 50;
            
            spheres.push(this.mesh);
        }
        return spheres;
    }
    
}

