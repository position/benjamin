import { Directive, HostListener, Input } from '@angular/core';
import * as THREE from 'three-full';
@Directive({
    selector: '[appResize]'
})
export class ResizeDirective {
    @Input('canvas') canvas: HTMLCanvasElement;
    @Input('camera') camera: THREE.PerspectiveCamera;
    @Input('renderer') renderer: THREE.WebGLRenderer;

    constructor() { 
    }

    @HostListener('window:resize', ['$event']) onResize(event: Event) {
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        //console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);
        let height: number = this.canvas.clientHeight;
        let aspectRatio: number = this.canvas.clientWidth / this.canvas.clientHeight;
        if (height === 0) {
            aspectRatio = 0;
        }
        this.camera.aspect = aspectRatio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
}
