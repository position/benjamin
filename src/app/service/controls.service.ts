import { Injectable } from '@angular/core';
import * as THREE from 'three-full';

@Injectable({
    providedIn: 'root'
})
export class ControlsService {

    constructor() { }

    public addControl(controls: THREE.OrbitControls) {
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.enableZoom = false;
        controls.enableRotate = false;
    }

    public removeControl(controls: THREE.OrbitControls) {
        controls.dispose();
    }
}
