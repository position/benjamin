import { Injectable } from '@angular/core';
import * as THREE from 'three-full';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ModelLoaderService {
    private objLoader = new THREE.OBJLoader();
    private modelPath: string = environment.assetsPath + 'models/';
    constructor() { }

    public objLoad(filename: string): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.objLoader.load(this.modelPath + filename + '.obj',
            (obj: any) => {
                if (obj) {
                    resolve(obj);
                }
                reject(new Error('Request is failed'));
            },
            (xhr: any) => {
                console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded (' + filename  + '.obj)');
            });
        });
    }
}
