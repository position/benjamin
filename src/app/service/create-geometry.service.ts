import { Injectable } from '@angular/core';
import * as THREE from 'three-full';

@Injectable({
	providedIn: 'root'
})
export class CreateGeometryService {
    public scene: THREE.Scene;
    public mesh: THREE.Mesh;
    public box: THREE.BoxBufferGeometry;
    public sphere: THREE.SphereBufferGeometry;
    public octahedron: THREE.OctahedronBufferGeometry;
    public dest: THREE.PlaneGeometry;
    public email: THREE.PlaneGeometry;
    public meterial: THREE.MeshLambertMaterial;
    
	constructor() { }

	public getBoxs(boxIndex: number){
        let boxs = [];
        for(let i = 0; i < boxIndex; i++){
            this.box = new THREE.BoxBufferGeometry(1, 1, 1);
            this.meterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });    
            this.mesh = new THREE.Mesh(this.box, this.meterial);
            this.mesh.position.x = Math.random() * 50 - i;
            this.mesh.position.y = Math.random() * 50 - i;
            this.mesh.position.z = Math.random() * 50 - i;
            this.mesh.scale.x = Math.random() + 0.5;
            this.mesh.scale.y = Math.random() + 0.5;
            this.mesh.scale.z = Math.random() + 0.5;
            boxs.push(this.mesh);
        }
        return boxs;
    }

    public getSphere(sphereIndex: number){
        let spheres = [];
        for(let i = 0; i < sphereIndex; i++){
            let radius = Math.random() * 1;
            this.sphere = new THREE.SphereBufferGeometry(radius, 30, 30);
            //color: 0xbad790
            this.meterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
            
            this.mesh = new THREE.Mesh(this.sphere, this.meterial);
            this.mesh.position.x = Math.random() * 50;
            this.mesh.position.y = Math.random() * 50 + 0.5;
            this.mesh.position.z = Math.random() * 50;
            
            spheres.push(this.mesh);
        }
        return spheres;
    }

    public getOctahedron(octahedronIndex: number){
        let octahedrons = [];
        for(let i = 0; i < octahedronIndex; i++){
            let radius = Math.random() * 1;
            this.octahedron = new THREE.OctahedronBufferGeometry(radius, 0);
            this.meterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });

            this.mesh = new THREE.Mesh(this.octahedron, this.meterial);
            this.mesh.position.x = Math.random() * 50;
            this.mesh.position.y = Math.random() * 50 + 0.5;
            this.mesh.position.z = Math.random() * 50;
            
            octahedrons.push(this.mesh);
        }
        return octahedrons;
    }

    public getDustParticle(dustIndex: number){
        let dusts = [];
        const min: number = -100;
        const max: number = 100;
        for(let i = 0; i < dustIndex; i++){
            this.dest = new THREE.PlaneGeometry(0.1, 0.1, 1);
            this.meterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });

            this.mesh = new THREE.Mesh(this.dest, this.meterial);
            this.mesh.rotation.x = Math.random() * 10;
            this.mesh.rotation.y = Math.random() * 10;
            this.mesh.rotation.z = Math.random() * 10;
            this.mesh.position.x = (Math.random() * (max - min)) + min;
            this.mesh.position.y = (Math.random() * max) - max;
            this.mesh.position.z = (Math.random() * (max - min)) + min;

            dusts.push(this.mesh);
        }
        return dusts;
    }

    public getPlaneParticle(planeIndex: number){
        let planes = [];
        const min: number = -50;
        const max: number = 50;
        for(let i = 0; i < planeIndex; i++){
            this.email = new THREE.PlaneGeometry(0.5, 1, 1);
            this.meterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            
            this.mesh = new THREE.Mesh(this.email, this.meterial);

            this.mesh.position.x = (Math.random() * (max - min)) + min;
            this.mesh.position.y = Math.random() * 50;
            this.mesh.position.z = (Math.random() * (max - min)) + min;

            planes.push(this.mesh);
        }

        return planes;
    }

    public destoryGeometry(scene: THREE.Scene, geometry: THREE.Mesh){
        scene.remove(geometry);
    }
}
