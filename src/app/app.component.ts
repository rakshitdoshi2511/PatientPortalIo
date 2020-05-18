import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import {GlobalService} from './services/global.service';
import { Constant } from './constant';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  layoutDir: string = 'ltr';
  layoutDirSideMenu: string = 'start';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private bnIdle: BnNgIdleService,
    private router: Router,
    private global:GlobalService,
    private constant: Constant,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.translate.setDefaultLang('en');
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    console.log("Platform" + this.platform);
    //60seconds idle time out
    this.bnIdle.startWatching(this.constant.sessionTimeOut).subscribe((isTimedOut: boolean) => {
      // if (res) {
        console.log("Session Expiry");
        // this.bnIdle.stopTimer();
        // this.router.navigateByUrl('login');
      // }
    });

    //Set App Direction based on language selected
    this.translate.onLangChange.subscribe((event:LangChangeEvent)=>{
      event.lang == 'ar'? this.layoutDir = 'rtl' : this.layoutDir = 'ltr';
      event.lang == 'ar'? this.layoutDirSideMenu = 'end': this.layoutDirSideMenu = 'start';
    })
  }

}
