import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three-full';
import * as Stats from 'stats.js';
import * as dat from 'dat.gui';

@Injectable({
    providedIn: 'root'
})
export class StatsHelperService {
    public stats: Stats = new Stats();

    constructor() {
    }

    public addStats(elementRef: ElementRef) {
        elementRef.nativeElement.appendChild(this.stats.dom);
    }

    public updateStats() {
        this.stats.update();
    }

    public setDatGui(gui: dat.GUI, camera: THREE.PerspectiveCamera) {
        const options = {
            reset: () => {
                console.log('reset click');
                camera.position.x = 20;
                camera.position.y = 30;
                camera.position.z = 60;
            }
        };
        const cam = gui.addFolder('Camera');
        cam.add(camera.position, 'x', -200, 200, 1).listen();
        cam.add(camera.position, 'y', -200, 200, 1).listen();
        cam.add(camera.position, 'z', -200, 200, 1).listen();
        cam.add(camera, 'fov', 1, 150).listen();

        cam.open();

        gui.add(options, 'reset');
    }

    public destroyDatGui(gui: dat.GUI) {
        gui.destroy();
    }
}
