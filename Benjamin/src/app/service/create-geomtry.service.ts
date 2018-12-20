import { Injectable } from '@angular/core';
import * as THREE from 'three-full';

@Injectable({
	providedIn: 'root'
})
export class CreateGeomtryService {
	public camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;
    public mesh: THREE.Mesh;
    public geometry = new THREE.BoxGeometry(1, 1, 1);
    public sphere = THREE.SphereGeometry;
    public meterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
	constructor() { }

	public setBoxs(boxIndex: number){
        let cubes = [];
        for(let i = 0; i < boxIndex; i++){
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

    public setSphere(sphereIndex: number){
        let spheres = [];
        for(let i = 0; i < sphereIndex; i++){
            let radius = Math.random() * 1;
            this.sphere = new THREE.SphereGeometry(radius, 30, 30);
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
}
