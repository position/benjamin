import { Injectable } from '@angular/core';
import * as THREE from 'three-full';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ControlsService {

    constructor() { }

    public addControl(controls: THREE.OrbitControls, dom: any, camera: THREE.PerspectiveCamera) {
        controls = new THREE.OrbitControls(camera);
        if(environment.production){
            controls.enableZoom = false;
            controls.enableRotate = false;
        }
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.domElement = dom;
    }
}
