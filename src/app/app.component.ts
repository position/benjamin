import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { fadeAnimation } from './app-routing.animation';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { mergeMap, map, filter } from 'rxjs/operators';
import { FacebookService, InitParams } from 'ngx-facebook';
//import { myProfile } from './interface/profile';
//import { Subscription } from 'rxjs';
//import { KakaoLoginService } from './service/kakao-login.service';

@Component({
    selector: 'uxe-benjamin',
    templateUrl: './app.component.html',
    animations: [ fadeAnimation ]
})
export class AppComponent implements OnInit, OnDestroy{
    public userPhoto: string;
    public navLinks = [
        { path: 'profile', label: 'Profile' },
        { path: 'introduction', label: 'Introduction' },
        { path: 'portfolio', label: 'Portfolio' },
        { path: 'contact', label: 'Contact' }
    ];

    public isLoginStatue: boolean;
    public dataFbLogin: string;
    public userThumImg: string;
    public userName: string;
    public accessToken: string;

    // private myProfileSubscription: Subscription;
    // private myFriendsSubscription: Subscription;
    // private isLoginSubscription: Subscription;
    // public myProfileList: myProfile[] = [];

    constructor(
        private titleService: Title,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FacebookService,
        private zone: NgZone,
        private cd: ChangeDetectorRef
        //private loginService: KakaoLoginService
    ){
        this.isLoginStatue = false;
        this.userName = 'Your name';
        this.dataFbLogin = 'off';
    }

    ngOnInit(){
        this.init();
        this.facebookInit();
    }

    public init() {

        this.onActiveRouteTitle();
        /*
        this.loginService.getLoginToken();
        this.myProfileSubscription = this.loginService.responseProfile.subscribe((item) => {
            this.zone.runOutsideAngular(() => {
                console.log('item', item);
                this.myProfileList.push(item.properties);
                this.zone.run(() => { this.cd.markForCheck(); });
            });
        });

        this.myFriendsSubscription = this.loginService.responseFriends.subscribe((item) => {
            this.zone.runOutsideAngular(() => {
                console.log('friends item', item);
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
        */

    }

    facebookInit(){
        this.zone.runOutsideAngular(() => {
            let initParams: InitParams = {
                appId: '924070751275511',
                cookie: true,
                xfbml: true,
                version: 'v4.0'
            };

            this.fb.init(initParams);
            this.fb.getLoginStatus()
                .then(this.checkLoginStatus);
        });
    }

    private checkLoginStatus = (response: any): void => {

        if(!response) {
            return;
        }

        const authBtn = document.querySelector('.fbAuthBtn');
        this.accessToken = response.authResponse.accessToken;

        if(response.status === 'connected'){
            authBtn.textContent = 'Logout';
            this.dataFbLogin = 'on';
            this.fb.api('/me')
                .then((response) => {
                    this.userName = ' Welcome, ' + response.name;
                })
                .catch(e => console.error('Error user name', e));
            this.fb.api('/me/picture?redirect=false')
                .then((response) => {
                    this.userThumImg = response.data.url;
                    this.isLoginStatue = true;

                    if(this.accessToken){
                        this.requestUserPhotos();
                    } else {
                        return;
                    }
                })
                .catch(e => console.error('Error user picture', e));


        } else {
            console.log('disconnect');
            authBtn.textContent = 'Facebook Login';
            this.isLoginStatue = false;
        }
    }

    onFacebookLogin(e: Event){
        e.preventDefault();
        if(this.dataFbLogin === 'off'){
            this.dataFbLogin = 'on';
            this.fb.login({auth_type: 'reauthorize'})
                .then((response) => {
                    this.checkLoginStatus(response);
                    console.log('login =>', response);
                })
                .catch(e => console.error('Error logging in', e));
        } else {
            this.dataFbLogin = 'off';
            this.fb.logout()
                .then((response: Promise<any>) => {
                    this.checkLoginStatus(response);
                    console.log('logout =>', response);
                })
                .catch(e => console.error('Error logging out', e));
        }
    }

    requestUserPhotos(){
        this.fb.api(`/me?fields=photos{images}`)
            .then((response) => {
                let userPhotos = response.photos.data;
                if(userPhotos && userPhotos.length > 0){
                    let filteredPhotos = userPhotos[0].images.filter((image: any) => {
                        return image.width === 640
                    });
                    filteredPhotos.forEach((image: any) => {
                        this.userPhoto = image.source;
                    });
                    console.log(this.userPhoto);
                }
            })
            .catch(e => console.error('Error request user photos', e));
    }

    private onActiveRouteTitle(){
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(route => {
                    console.log(route);
                    while (route.firstChild) {
                        console.log(route.firstChild.params);

                        route = route.firstChild;
                    }
                    return route;
                }
            ),
            mergeMap((route) => route.data))
            .subscribe(item => { this.titleService.setTitle(item.title); }
        );
    }

    ngOnDestroy(){
        // this.loginService.kakaoCleanup();
        // this.myProfileSubscription.unsubscribe();
        // this.myFriendsSubscription.unsubscribe();
        // this.isLoginSubscription.unsubscribe();
    }

}
