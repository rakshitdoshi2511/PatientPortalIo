import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './../services/api.service';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { PopoverController, AlertController, Platform, ModalController } from '@ionic/angular';
import { DataService } from './../services/data.service';
import { LoaderService } from './../services/loader.service';
import { Constant } from './../constant';
import { Events } from './../services/event.service';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { MenuController } from '@ionic/angular';
import {CustomAlertComponent} from './../custom-alert/custom-alert.component'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  version: string = "";
  model: any = {};
  appPages: any = [];

  constructor(
    private _api: ApiService,
    private translate: TranslateService,
    private storage: Storage,
    public alertController: AlertController,
    private _loader: LoaderService,
    private _dataServices: DataService,
    private constant: Constant,
    private events: Events,
    private router:Router,
    private bnIdle:BnNgIdleService,
    private menuCtrl: MenuController,
    private platform: Platform,
    private modalController: ModalController,
  ) { }

  /**Dialogs and Loaders */
  async openModal() {
    const modal = await this.modalController.create({
      component: CustomAlertComponent,
      backdropDismiss: false,
      componentProps: { viewName : 'UserPopover'},
    });
    return await modal.present();
  }

  /**Helper Methods*/
  getImagePath(p) {
    return p.iconPath;
  }
  getAlignmentClassRight() {
    return this.translate.getDefaultLang() == 'en' ? 'pull-right' : 'pull-left';
  }
  getAlignmentClassLeft() {
    return this.translate.getDefaultLang() == 'en' ? 'pull-left' : 'pull-right';
  }
  getFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Futura-Medium' : 'Helvetica-Arabic-Medium';
  }
  /**Default Methods */
  ngOnInit() {
    let that = this;
    //console.log("Setting names from api");
    //console.log(this._api.getLocal('firstName'));
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;

    this.model.firstName = this._api.getLocal('firstName');
    this.model.lastName = this._api.getLocal('lastName');
    this.model.mrn = this._api.getLocal('mrn');
    this.model.email = this._api.getLocal('email');

    this.events.subscribe('user-data', (_data: any) => {
      //console.log("Subscription");
      //console.log(_data);
      this.model.firstName = _data.Vname;
      this.model.lastName = _data.Nname;
      this.model.mrn = _data.Patnr;
      this.model.age = _data.Age;
      this.model.sex = _data.Sex;
      this.model.birthDate = moment(_data.Gbdat.toString().replace(/\//g, "")).format("DD.MM.YYYY");
      this.model.contact = _data.PhoneNo;
      this.model.email = _data.Emailid;
      this.version = environment.ver;

    })

    // that.storage.get(that._api.getLocal('token')).then((val) => {
    //   let _data = val;
    //   //that._loader.hideLoader();
    //   console.log(_data);
    //   if (_data != null && Object.keys(_data).length > 0) {
    //     this.model.firstName = _data.Vname;
    //     this.model.lastName = _data.Nname;
    //     this.model.mrn = _data.Patnr;
    //     this.model.age = _data.Age;
    //     this.model.sex = _data.Sex;
    //     this.model.birthDate = moment(_data.Gbdat.toString().replace(/\//g, "")).format("DD.MM.YYYY");
    //     this.model.contact = '';
    //     this.model.email = _data.Emailid;
    //   }
    // });
    let _pages = [
      { title: this.translate.instant('sidemenu_home'), url: '/home', iconName: 'home', iconPath: './assets/icon/icon_amc_home_blue.svg' },
      { title: this.translate.instant('sidemenu_lab'), url: "laboratory", iconName: 'card', iconPath: './assets/icon/icon_amc_flask_blue.svg' },
      { title: this.translate.instant('sidemenu_nutrition'), url: 'nutrition', iconName: 'person', iconPath: './assets/icon/icon_amc_nutrition_blue.svg' },
      { title: this.translate.instant('sidemenu_radiology'), url: 'radiology', iconName: 'notifications', iconPath: './assets/icon/icon_amc_radiology_blue.svg' },
      { title: this.translate.instant('sidemenu_medical'), url: 'medical-reports', iconName: 'notifications', iconPath: './assets/icon/icon_amc_report_blue.svg' }];
    this.appPages = _pages;
  }
  ionViewDidEnter() {
    let that = this;

    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;

    this.model.firstName = this._api.getLocal('firstName');;
    this.model.lastName = this._api.getLocal('lastName');
    this.model.mrn = this._api.getLocal('mrn');
    this.model.email = this._api.getLocal('email');

    //console.log("ionView Enter");
    that.storage.get(that._api.getLocal('token')).then((val) => {
      let _data = val;
      //console.log(_data);
      //that._loader.hideLoader();
      if (_data != null && Object.keys(_data).length > 0) {
        this.model.firstName = _data.Vname;
        this.model.lastName = _data.Nname;
        this.model.mrn = _data.Patnr;
        this.model.age = _data.Age;
        this.model.sex = _data.Sex;
        this.model.birthDate = moment(_data.Gbdat.toString().replace(/\//g, "")).format("DD.MM.YYYY");
        this.model.contact = _data.PhoneNo;
        this.model.email = _data.Emailid;
      }

    });
    this.events.subscribe('user-data', (_data: any) => {
      //console.log("Subscription");
      //console.log(_data);
      this.model.firstName = _data.Vname;
      this.model.lastName = _data.Nname;
      this.model.mrn = _data.Patnr;
      this.model.age = _data.Age;
      this.model.sex = _data.Sex;
      this.model.birthDate = moment(_data.Gbdat.toString().replace(/\//g, "")).format("DD.MM.YYYY");
      this.model.contact = _data.PhoneNo;
      this.model.email = _data.Emailid;

    })
  }
  /**Screen Interaction */
  logOut() {
    this.menuCtrl.close();
    this.deleteSession();
  }
  switchLanguage() {
    //console.log(this.model.language);
    this.menuCtrl.close();
    this.model.language ? this.translate.use('en') : this.translate.use('ar');
    this.model.language ? this.translate.setDefaultLang('en') : this.translate.setDefaultLang('ar');
    
  }
  resetPassword() {
    this.menuCtrl.close();
    this.openModal();
  }
  deleteSession() {
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
        let _obj = {
          'isLogOut':true
        };
        this.events.publish('stop-timer',_obj);
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
        let _obj = {
          'isLogOut':true
        };
        this.events.publish('stop-timer',_obj);
        this.router.navigateByUrl('login');
      }
    )
  }


}
