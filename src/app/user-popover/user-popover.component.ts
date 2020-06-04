import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, AlertController, ModalController } from '@ionic/angular';
import { DataService } from './../services/data.service';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import Swal from 'sweetalert2';
import {CustomAlertComponent} from './../custom-alert/custom-alert.component'
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent implements OnInit {

  model: any = {};
  constructor(
    private translate: TranslateService,
    public popoverControl: PopoverController,
    private _api: ApiService,
    private storage: Storage,
    private _loader: LoaderService,
    public alertController: AlertController,
    private _dataServices: DataService,
    private modalController: ModalController,
    private router:Router
  ) { }

  /**Alerts and Dialogs */
  async openModal() {
    const modal = await this.modalController.create({
      component: CustomAlertComponent,
      backdropDismiss: false,
      componentProps: { },
    });
    return await modal.present();
  }
  /**Default Methods */
  ngOnInit() {
    let that = this;
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
    that.storage.get(that._api.getLocal('token')).then((val) => {
      let _data = val;
      console.log(_data);
      if (Object.keys(_data).length > 0) {
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
  }
  ionViewDidEnter(){
    let that = this;
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
    that.storage.get(that._api.getLocal('token')).then((val) => {
      let _data = val;
      console.log(_data);
      if (Object.keys(_data).length > 0) {
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
  }
  resetPassword() {
    this.popoverControl.dismiss();
    this.openModal();
  }
  logOut() {
    this.deleteSession();
  }
  switchLanguage() {
    console.log(this.model.language);
    this.popoverControl.dismiss();
    this.model.language ? this.translate.use('en') : this.translate.use('ar');
    this.model.language ? this.translate.setDefaultLang('en') : this.translate.setDefaultLang('ar');
    
  }
  /**Data API */
  deleteSession() {
    let that = this;
    let msg = this.translate.instant('dialog_title_logout');
    this._loader.showLoader(msg);

    let _param = {
      Patnr: that._api.getLocal('username'),
      Token: that._api.getLocal('token'),
      //Password:that._api.getLocal('password')
    }

    that._dataServices.deleteSession('SESSIONSET', _param, null, false, null, false).subscribe(
      _success => {
        that._loader.hideLoader();
        this.popoverControl.dismiss();
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
        
       // window.location.reload();

      }, _error => {
        that._loader.hideLoader();
        this.popoverControl.dismiss();
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
        //window.location.reload();
      }
    )
  }
}
