import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { fadeAnimation } from './app-routing.animation';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { mergeMap, map, filter } from 'rxjs/operators';
import { myProfile } from './interface/profile';

@Component({
    selector: 'uxe-benjamin',
    templateUrl: './app.component.html',
    animations: [ fadeAnimation ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
    public navLinks = [
        { path: 'profile', label: 'Profile' },
        { path: 'introduction', label: 'Introduction' },
        { path: 'portfolio', label: 'Portfolio' },
        { path: 'contact', label: 'Contact' }
    ];

    public myProfileList: myProfile[] = [];

    constructor(
        private titleService: Title,
        private router: Router,
        private activatedRoute: ActivatedRoute,
		private zone: NgZone,
		private cd: ChangeDetectorRef
    ){
    }

    ngOnInit(){
        this.onActiveRouteTitle();
        //this.onActiveRoutePath();
    }

    private onActiveRouteTitle(){
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(route => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }
            ),
            mergeMap((route) => route.data))
            .subscribe(item => { this.titleService.setTitle(item.title); }
        );

        // this.router.navigateByUrl('/refresh', { skipLocationChange: true })
        //     .then(()=> this.router.navigate(['contact']));
        
    }    
        
        

    /*
    private onActiveRoutePath(){
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(route => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }
            ),
            mergeMap((route) => route.url))
            .subscribe(item => { this.routePath = item[0].path }
        );
    }
    */
    ngOnDestroy(){
    }
}
