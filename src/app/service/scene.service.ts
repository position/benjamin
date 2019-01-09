import { Injectable } from '@angular/core';
import * as THREE from 'three-full';
import { FontLoaderService} from '../service/font-loader.service';
//import { CreateGeometryService } from '../service/create-geometry.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SceneService {
    readonly cameraView: any = {
        fieldOfView : 50,
        nearClippingPane : 1,
        farClippingPane : 1100    
    };
    
    constructor(
        private fontLoader: FontLoaderService
        //private createGeometry: CreateGeometryService
        ){ }

    public createScene(scene: THREE.Scene, bgColor: number) {
        scene.background = new THREE.Color(bgColor);
        this.onCreateSphere(scene, bgColor);
        if(!environment.production){
            const grid = new THREE.GridHelper(100, 50);
            const axes = new THREE.AxesHelper(200);
            scene.add(grid);
            scene.add(axes);
        }
    }

    private onCreateSphere(scene: THREE.Scene, bgColor: number){
        let material_univ = new THREE.MeshLambertMaterial({
            color: bgColor,
            side: THREE.BackSide
        });
        let geometry_univ = new THREE.SphereGeometry(60, 32, 32);
        let mesh = new THREE.Mesh(geometry_univ, material_univ);
        
        scene.add(mesh);
    }

    public createPlane(scene:THREE.Scene, bgColor: number){
        let geometry = new THREE.PlaneGeometry(120, 120, 0);
        let material = new THREE.MeshStandardMaterial({ color: bgColor, side: THREE.DoubleSide });
        let plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(0, 0, 0);
        scene.add(plane);
    }

    public createLight(scene:THREE.Scene, lightColor: number) {
        const light = new THREE.DirectionalLight(lightColor, 1);
        
        light.position.set(-30, 50, 50);
        light.angle = Math.PI / 5;
        scene.add(light);
        if(!environment.production){
            const lightHelper = new THREE.DirectionalLightHelper( light, 15 );
            scene.add(lightHelper);
        }
        //const spotLight = new THREE.SpotLight(lightColor, 1, 30, Math.PI / 4, 1);
        //const spotLightHelper = new THREE.SpotLightHelper( spotLight, 1 );
        //spotLight.position.set(0, 30, 0);
        //this.scene.add(spotLight);
        //this.scene.add(spotLightHelper);
    }

    public createCamera(camera: THREE.PerspectiveCamera, x: number, y: number, z: number, aspectRatio: number) {
        camera.fov = this.cameraView.fieldOfView;
        camera.near = this.cameraView.nearClippingPane;
        camera.far = this.cameraView.farClippingPane;
        camera.aspect = aspectRatio;
        // Set position and look at
        camera.position.set(x, y, z);
    }
    
    public async createText(text: string, scene:THREE.Scene, textMesh: THREE.Mesh, fontColor: number, position: any): Promise<void>{
        let response = await this.fontLoader.onFontLoader();
        const textGeometry = new THREE.TextGeometry(text, {
            font: response,
            size: 5,
            height: 1,
            curveSegment: 12,
            bevelEnabled: false,
            side: THREE.DoubleSide
        });
        const material = new THREE.MeshPhongMaterial({ 
            color: fontColor,
            specular: 0xffffff,
            shininess: 30
        });
        textMesh.geometry = textGeometry;
        textMesh.material = material;
        textMesh.position.set(position.x, position.y, position.z);
        scene.add(textMesh);
    }
    /*
    public createGeometrys(scene:THREE.Scene, geometry: THREE.Mesh, amount: number, type: string){
        switch(type){
            case 'sphere':
                geometry = this.createGeometry.setSphere(amount);
            break;

            case 'octahedron':
                geometry = this.createGeometry.setOctahedron(amount);
            break;

            case 'box':
                geometry = this.createGeometry.setBoxs(amount);
            break;

            default:
                console.error('Find not type!!');
        }
        geometry.forEach((item: any) => {
            scene.add(item);
        });
    }
    */
}
