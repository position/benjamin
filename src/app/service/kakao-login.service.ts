import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Kakao from '../../assets/js/kakao.min.js';

@Injectable({
    providedIn: 'root'
})
export class KakaoLoginService {
    constructor(
        @Inject (HttpClient) protected http: HttpClient
    ) { 
        //this.getLoginToken();
    }
    
    readonly appKey: string ='5bf586648691c53a1e9e38bce5b06d03';
    
    getLoginToken(){
        // 사용할 앱의 JavaScript 키를 설정해 주세요.
		Kakao.init(this.appKey);
		// 카카오 로그인 버튼을 생성합니다.
		Kakao.Auth.createLoginButton({
			container: '#kakao-login-btn',
			success: (authObj: any) => {
                console.log((authObj));
				Kakao.API.request({
                    url: '/v2/user/me',
                    success: (res: any) => {
                        console.log('res', res);
                    }
                });
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
