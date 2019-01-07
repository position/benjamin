import { Injectable } from '@angular/core';
import * as THREE from 'three-full';

@Injectable({
    providedIn: 'root'
})
export class ControlsService {

    constructor() { }

    public addControl(controls: THREE.OrbitControls, dom: any, camera: THREE.PerspectiveCamera) {
        controls = new THREE.OrbitControls(camera);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.domElement = dom;
    }
}
