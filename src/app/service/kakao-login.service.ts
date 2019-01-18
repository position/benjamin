import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import * as Kakao from '../../assets/js/kakao.min.js';

@Injectable({
    providedIn: 'root'
})
export class KakaoLoginService {
    readonly appKey: string ='5bf586648691c53a1e9e38bce5b06d03';
    public response: Subject<any>;
    public isLogin: BehaviorSubject<boolean>;
    
    constructor(
        @Inject (HttpClient) protected http: HttpClient
    ) { 
        this.response = new Subject<any>();
        this.isLogin = new BehaviorSubject<boolean>(false);
    }
    
    getLoginToken(){
        // 사용할 앱의 JavaScript 키를 설정해 주세요.
        Kakao.init(this.appKey);
        // 카카오 로그인 버튼을 생성합니다.
        Kakao.Auth.createLoginButton({
            container: '#kakao-login-btn',
            success: (auth: any) => {
                console.log('auth', auth);
                this.isLogin.next(auth ? true : false);
                this.getMyData();
            },
            fail: (err: any) => {
                alert(JSON.stringify(err));
            }
        });
    }

    getMyData(){
        Kakao.API.request({
            url: '/v2/user/me',
            success: (res: any) => {
                this.response.next(res);
            },
            fail: (err: any) => {
                alert(JSON.stringify(err));
            }
        });
    }

    getAccessToken(){
        Kakao.Auth.getAccessToken();
    }

    loginCleanup(){
        Kakao.Auth.cleanup();
    }

    kakaoCleanup(){
        Kakao.cleanup();
    }

}
