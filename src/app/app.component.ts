import { HostListener, Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router, ActivatedRoute, NavigationCancel, NavigationEnd } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { GlobalService } from './services/global.service';
import { Constant } from './constant';
import Swal from 'sweetalert2';
import { ApiService } from './services/api.service';
import { Storage } from '@ionic/storage';
import { DataService } from './services/data.service';
import { Events } from './services/event.service';
import { LoaderService } from './services/loader.service';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  layoutDir: string = 'ltr';
  layoutDirSideMenu: string = 'start';
  subscription: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private bnIdle: BnNgIdleService,
    private router: Router,
    private global: GlobalService,
    private constant: Constant,
    private _api: ApiService,
    private storage: Storage,
    private _dataServices: DataService,
    private events: Events,
    private _loader: LoaderService
  ) {
    this.initializeApp();
  }

  ignoreKeys() {
    return ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
  }
  keyValuePairs(object) {
    var array = [];
    for (var key in object) {
      if (this.ignoreKeys().indexOf(key) < 0) {
        var value = object[key],
          float = parseFloat(value);
        array.push({
          key: key,
          value: value || ''
        });
      }
    }
    return array;
  }

  generateURL(entitySetName, params, filters, isPost, expandEntities, isExpand) {
    let url = entitySetName;
    if (!isPost && params) params = this.keyValuePairs(params);
    if (!isPost && filters) filters = this.keyValuePairs(filters);
    if (!isPost && params) {
      url += '(';
      params.forEach(function (param, index) {
        if (index > 0) {
          url += ',';
        }
        url += param.key + "='" + encodeURIComponent(param.value) + "'";
      });
      url += ')';
    }
    if (!isPost && filters) {
      url += '?$filter=';
      filters.forEach(function (filter, index) {
        if (index > 0) {
          url += encodeURIComponent(' and ');
        }
        url += filter.key + encodeURIComponent(" eq '" + filter.value) + "'";
      });
    }
    if (isExpand) {
      url += '?$expand=';
      let _expandedEntities = expandEntities.toString();
      url += _expandedEntities;
    }
    return url;
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.deleteSession();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(e) {
    // console.log(event);
    // event = event || window.event;

    // // For IE and Firefox prior to version 4
    // if (event) {
    //     event.returnValue = 'Sure?';
    // }

    // // For Safari
    // return 'Sure?';
    // this._api.setLocal('test',new Date());
    // e.preventDefault();
    // e.returnValue = '';
    let _param = {
      Patnr: this._api.getLocal('username'),
      Token: this._api.getLocal('token')
    }

    let _url = this.generateURL("SESSIONSET", _param, null, false, null, false);
    let url = environment.url + _url
    this._api.setLocal("URL", url);
    // var client = new XMLHttpRequest();

    // client.open("GET", url, false); // third parameter indicates sync xhr
    // client.setRequestHeader("Content-Type", "application/json");
    // client.send();
    navigator.sendBeacon(url,null);
    console.log('done!!!');

    // this.deleteSession();

  }

  @HostListener('window:onunload', ['$event'])
  onUnloadHandler(event) {
    // console.log(event);
    //this.deleteSession();
  }

  initializeApp() {

    this.translate.setDefaultLang('en');
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    //console.log("Platform" + this.platform);
    //60seconds idle time out

    this.events.subscribe('session-data', (_data: any) => {
      //console.log("App Session");
      //console.log(_data.BrowserTimeout);
      this.bnIdle.startWatching(_data.BrowserTimeout).subscribe((isTimedOut: boolean) => {
        console.log("Session Expiry");
        this.bnIdle.resetTimer();
        this.bnIdle.stopTimer();
        let msg = this.translate.instant('alert_title_session_expired_msg');

        Swal.fire({
          title: this.translate.instant('alert_title_session_expired'),
          text: msg,
          backdrop: false,
          icon: 'error',
          confirmButtonColor: 'rgb(87,143,182)',
          confirmButtonText: this.translate.instant('lbl_filter_ok')
        }).then((result) => {
          this.deleteSession();
        });

        // Swal.fire(this.translate.instant('alert_title_session_expired'), msg, 'error').then((result)=>{
        //  this.deleteSession();
        // })
      });
    })

    this.events.subscribe('stop-timer', (_data: any) => {
      //this.bnIdle.resetTimer();
      this.bnIdle.stopTimer();
    })

    this.events.subscribe('reset-timer', (_data: any) => {
      this.bnIdle.resetTimer();
    })


    //Set App Direction based on language selected
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      event.lang == 'ar' ? this.layoutDir = 'rtl' : this.layoutDir = 'ltr';
      event.lang == 'ar' ? this.layoutDirSideMenu = 'end' : this.layoutDirSideMenu = 'start';
    })
  }

  deleteSession() {
    if (this._api.getLocal('token') && this._api.getLocal('token') != null) {
      let that = this;
      let msg = this.translate.instant('dialog_title_logout');
      this._loader.showLoader(msg);

      let _param = {
        Patnr: that._api.getLocal('username'),
        Token: that._api.getLocal('token')
      }
      that._dataServices.deleteSession('SESSIONSET', _param, null, false, null, false).subscribe(
        _success => {
          that._loader.hideLoader();
          this.storage.clear();
          this._api.remLocal('isLoggedIn');
          this._api.remLocal('token');
          this._api.remLocal('username');
          this._api.remLocal('sessionTimeout');
          this._api.remLocal('password');
          this._api.remLocal('firstName');
          this._api.remLocal('lastName');
          this._api.remLocal('email');
          this._api.remLocal('mrn');
          this.router.navigateByUrl('login');


        }, _error => {
          that._loader.hideLoader();
          this.storage.clear();
          this._api.remLocal('isLoggedIn');
          this._api.remLocal('token');
          this._api.remLocal('username');
          this._api.remLocal('sessionTimeout');
          this._api.remLocal('password');
          this._api.remLocal('firstName');
          this._api.remLocal('lastName');
          this._api.remLocal('email');
          this._api.remLocal('mrn');
          this.router.navigateByUrl('login');
          //this.router.navigate(['/login'],{replaceUrl:true});
        }
      )
    }
    else {
      console.log("I am ehre but wont go");
    }
  }

}
