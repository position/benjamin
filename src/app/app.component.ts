import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { KakaoLoginService } from './service/kakao-login.service';
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
        { path: 'portfolio', label: 'Portfolio' }
    ];

    private myProfileSubscription: Subscription;
	private isLoginSubscription: Subscription;
	public myProfileList: myProfile[] = [];
	public isLogin: boolean = false;

    constructor(
        private titleService: Title,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loginService: KakaoLoginService,
		private zone: NgZone,
		private cd: ChangeDetectorRef
    ){
    }

    ngOnInit(){
        this.onActiveRouteTitle();
        //this.onActiveRoutePath();

        this.loginService.getLoginToken();

		this.myProfileSubscription = this.loginService.response.subscribe((item) => {
			this.zone.runOutsideAngular(() => {
				console.log('item', item);
				this.myProfileList.push(item.properties);
				console.log('this.myProfileList', this.myProfileList, this.isLogin);
				this.zone.run(() => { this.cd.markForCheck(); });
			});
		});

		this.isLoginSubscription = this.loginService.isLogin.subscribe(isLogin => {
			this.zone.runOutsideAngular(() => {
				this.isLogin = isLogin;
				console.log('islogin', isLogin);
				this.zone.run(() => { this.cd.markForCheck(); });
			});
		});
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
        this.loginService.kakaoCleanup();
        this.myProfileSubscription.unsubscribe();
        this.isLoginSubscription.unsubscribe();
    }
}
