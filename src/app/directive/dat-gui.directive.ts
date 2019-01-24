import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { environment } from '../../environments/environment';

@Directive({
    selector: '[appDatGui]'
})
export class DatGuiDirective implements OnInit{
    @Input('datCamera') camera: THREE.PerspectiveCamera;
    @Input('datGui') gui: dat.GUI;

    constructor() { }

    ngOnInit(){
        if(!environment.production){
            let options = {
                reset : () => {
                    console.log('reset click');
                    this.camera.position.x = 20;
                    this.camera.position.y = 30;
                    this.camera.position.z = 60;
                }   
            };
            let cam = this.gui.addFolder('Camera');
            cam.add(this.camera.position, 'x', -200, 200, 1).listen();
            cam.add(this.camera.position, 'y', -200, 200, 1).listen();
            cam.add(this.camera.position, 'z', -200, 200, 1).listen();
            cam.add(this.camera, 'fov', 1, 150).listen();
            
            cam.open();

            this.gui.add(options, 'reset');
        }
    }

    ngOnDestroy(){
        if(this.gui != null){
            this.gui.destroy();
        }
    }
}

