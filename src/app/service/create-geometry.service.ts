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
    public meterial: THREE.MeshLambertMaterial;
	constructor() { }

	public setBoxs(boxIndex: number){
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

    public setSphere(sphereIndex: number){
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

    public setOctahedron(octahedronIndex: number){
        let spheres = [];
        for(let i = 0; i < octahedronIndex; i++){
            let radius = Math.random() * 1;
            this.octahedron = new THREE.OctahedronBufferGeometry(radius, 0);
            this.meterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });

            this.mesh = new THREE.Mesh(this.octahedron, this.meterial);
            this.mesh.position.x = Math.random() * 50;
            this.mesh.position.y = Math.random() * 50 + 0.5;
            this.mesh.position.z = Math.random() * 50;
            
            spheres.push(this.mesh);
        }
        return spheres;
    }

    public destoryGeometry(scene: THREE.Scene, geometry: THREE.Mesh){
        scene.remove(geometry);
    }
}
