import { Injectable } from '@angular/core';
import * as THREE from 'three-full';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TextureLoaderService {
    private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    private imgPath: string = environment.assetsPath + 'img/';
    constructor() { }

    public onLoad(imgName: string){
        return new Promise<void>((resolve, reject) => {
            this.textureLoader.load(this.imgPath + imgName, (texture: any) => {
                if(texture){
                    resolve(texture);
                }
                reject(new Error('Request is failed'));
            });
        });
    }
}
