import { Injectable } from '@angular/core';
import * as THREE from 'three-full';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ControlsService {

    constructor() { }

    public addControl(controls: THREE.OrbitControls) {
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.enableZoom = false;
        if(environment.production){
            controls.enableRotate = false;
        }
    }

    public removeControl(controls: THREE.OrbitControls) {
        controls.dispose();
    }
}
