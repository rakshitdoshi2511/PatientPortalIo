import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import {GlobalService} from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private bnIdle: BnNgIdleService,
    private router: Router,
    private global:GlobalService,
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
    this.bnIdle.startWatching(this.global.sessionTimeout).subscribe((isTimedOut: boolean) => {
      // if (res) {
        console.log("Session Expiry");
        // this.bnIdle.stopTimer();
        // this.router.navigateByUrl('login');
      // }
    });
  }
}
