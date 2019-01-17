import { Component, OnInit, OnDestroy } from '@angular/core';
import { KakaoLoginService } from '../service/kakao-login.service';

@Component({
	selector: 'app-my-family',
	templateUrl: './my-family.component.html'
})
export class MyFamilyComponent implements OnInit, OnDestroy {
	public isLogin: boolean = false;
	constructor(
		private loginService: KakaoLoginService
	) { }

	ngOnInit() {
		this.loginService.getLoginToken();
		this.loginService.getAccessToken();
	}

	onLogin(e: Event){
		this.loginService.getLoginToken();
		this.isLogin = true;
	}

	ngOnDestroy(){
		this.loginService.kakaoCleanup();
	}
}
