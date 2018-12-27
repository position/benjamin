import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
    selector: 'benjamin-introduction',
    templateUrl: './introduction.component.html'
})
export class IntroductionComponent implements OnInit {
    public imgPath: string = environment.assetsPath;
    
    constructor() { }

    ngOnInit() {
    }

}
