import { Injectable } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SceneService {
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;

    public fieldOfView: number = 50;
    public nearClippingPane: number = 1;    
    public farClippingPane: number = 1100;

    public animationFrame: any;
    constructor(){ }

    public createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xd660d0);
        this.onCreateSphere();
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

    public createPlane(bgColor: number){
        let geometry = new THREE.PlaneGeometry(120, 120, 0);
        let material = new THREE.MeshStandardMaterial({ color: bgColor, side: THREE.DoubleSide });
        let plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(0, 0, 0);
        this.scene.add(plane);
    }

    public createLight(lightColor: number) {
        const light = new THREE.DirectionalLight(lightColor, 1);
        const lightHelper = new THREE.DirectionalLightHelper( light, 15 );
        light.position.set(-30, 50, 50);
        light.angle = Math.PI / 5;
        this.scene.add(light);
        this.scene.add(lightHelper);

        const spotLight = new THREE.SpotLight(lightColor, 1, 30, Math.PI / 4, 1);
        const spotLightHelper = new THREE.SpotLightHelper( spotLight, 1 );
        spotLight.position.set(0, 30, 0);
        //this.scene.add(spotLight);
        //this.scene.add(spotLightHelper);
    }

    public createCamera(x: number, y: number, z: number, aspectRatio: number) {
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );
        // Set position and look at
        this.camera.position.set(x, y, z);
    }
    
}
