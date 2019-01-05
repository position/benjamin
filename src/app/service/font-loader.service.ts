import { Injectable } from '@angular/core';
import * as THREE from 'three-full';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FontLoaderService {
    private textLoader = new THREE.FontLoader();
    private fontPath: string = environment.assetsPath + 'fonts/';

    constructor() { }

    public async onFontLoader(): Promise<any>{
        return new Promise<void>((resolve, reject) => {
            this.textLoader.load(this.fontPath + 'droid_serif_regular.typeface.json', (font: any) => {
                if(font){
                    resolve(font);
                } else {
                    reject(new Error('Request is failed'));
                }
            });
        });
    }
}
