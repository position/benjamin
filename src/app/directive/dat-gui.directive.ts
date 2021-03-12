import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { environment } from '../../environments/environment';

@Directive({
    selector: '[appDatGui]'
})
export class DatGuiDirective implements OnInit, OnDestroy {
    @Input('datCamera') camera: THREE.PerspectiveCamera;
    @Input('datGui') gui: dat.GUI;
    @Input('datCamPosition') cameraPosition: any;

    constructor() {
    }

    ngOnInit() {
        if (!environment.production && this.gui != null) {
            const options = {
                reset: () => {
                    console.log('reset click');
                    this.camera.position.x = this.cameraPosition.x;
                    this.camera.position.y = this.cameraPosition.y;
                    this.camera.position.z = this.cameraPosition.z;
                }
            };
            const cam = this.gui.addFolder('Camera');
            cam.add(this.camera.position, 'x', -200, 200, 1).listen();
            cam.add(this.camera.position, 'y', -200, 200, 1).listen();
            cam.add(this.camera.position, 'z', -200, 200, 1).listen();
            cam.add(this.camera, 'fov', 1, 150).listen();

            cam.open();

            this.gui.add(options, 'reset');
        }
    }

    ngOnDestroy() {
        if (this.gui != null) {
            this.gui.destroy();
        }
    }
}

