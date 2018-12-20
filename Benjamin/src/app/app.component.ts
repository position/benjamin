import { Component } from '@angular/core';
import { fadeAnimation } from './app-routing.animation';

@Component({
    selector: 'uxe-benjamin',
    templateUrl: './app.component.html',
    animations: [ fadeAnimation ]
})
export class AppComponent {
    public navLinks = [
        { path: 'profile', label: 'Profile' },
        { path: 'introduction', label: 'Introduction' },
        { path: 'portfolio', label: 'Portfolio' }
    ];
    constructor(){
    }
}
