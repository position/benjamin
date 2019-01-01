import { Injectable, ElementRef } from '@angular/core';
import * as Stats from 'stats.js';

@Injectable({
    providedIn: 'root'
})
export class StatsHelperService {
    public stats: Stats = new Stats();
    
    constructor() { }

    addStats(elementRef: ElementRef){
        elementRef.nativeElement.appendChild(this.stats.dom);    
    }

    updateStats(){
        this.stats.update();
    }

    
}
