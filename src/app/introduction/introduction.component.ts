import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
    selector: 'benjamin-introduction',
    templateUrl: './introduction.component.html'
})
export class IntroductionComponent implements OnInit {
    public assetPath: string = environment.assetsPath;
    public imgPath: string = environment.assetsPath + 'img/';
    public docPath: string = environment.assetsPath + 'doc/';
    
    constructor() { }

    ngOnInit() {
    }

}
