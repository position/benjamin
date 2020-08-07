import { Injectable } from '@angular/core';
import * as THREE from 'three-full';
import { FontLoaderService } from './font-loader.service';
import { TextureLoaderService } from './texture-loader.service';
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
        private fontLoader: FontLoaderService,
        private texture: TextureLoaderService) {
    }

    public createScene(scene: THREE.Scene, bgColor: number) {
        scene.background = new THREE.Color(bgColor);
        this.onCreateSphere(scene, bgColor);
        if (!environment.production) {
            const grid = new THREE.GridHelper(100, 50);
            const axes = new THREE.AxesHelper(200);
            scene.add(grid);
            scene.add(axes);
        }
    }

    private onCreateSphere(scene: THREE.Scene, bgColor: number) {
        const material_univ = new THREE.MeshLambertMaterial({
            color: bgColor,
            side: THREE.BackSide
        });
        const geometry_univ = new THREE.SphereGeometry(60, 32, 32);
        const mesh = new THREE.Mesh(geometry_univ, material_univ);

        scene.add(mesh);
    }

    public async createPlane(scene: THREE.Scene, bgColor: number) {
        const normalMapImg = 'sand_normal_map.jpg';
        const sandBg = await this.texture.onLoad(normalMapImg);
        const geometry = new THREE.PlaneGeometry(120, 120, 0);
        const material = new THREE.MeshStandardMaterial({ color: bgColor, side: THREE.DoubleSide, normalMap: sandBg });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(0, 0, 0);
        scene.add(plane);
    }

    public createLight(scene: THREE.Scene, lightColor: number) {
        const light = new THREE.DirectionalLight(lightColor, 1);

        light.position.set(-30, 50, 50);
        light.angle = Math.PI / 5;
        scene.add(light);
        if (!environment.production) {
            const lightHelper = new THREE.DirectionalLightHelper( light, 15 );
            scene.add(lightHelper);
        }
    }

    public createCamera(camera: THREE.PerspectiveCamera, x: number, y: number, z: number, aspectRatio: number) {
        camera.fov = this.cameraView.fieldOfView;
        camera.near = this.cameraView.nearClippingPane;
        camera.far = this.cameraView.farClippingPane;
        camera.aspect = aspectRatio;
        // Set position and look at
        camera.position.set(x, y, z);
    }

    public async createText(text: string, scene: THREE.Scene, textMesh: THREE.Mesh, fontColor: number, position: any): Promise<void> {
        const response = await this.fontLoader.onFontLoader();
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
}
