import { Component } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { HelpComponent } from '../help/help.component';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { DataService } from './../services/data.service';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Constant } from './../constant';
import { Events } from './../services/event.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tiles: any = [];
  model: any = {};

  constructor(
    public popoverController: PopoverController,
    public platform: Platform,
    private translate: TranslateService,
    private _dataServices: DataService,
    private _loader: LoaderService,
    private _api: ApiService,
    private storage: Storage,
    private router:Router,
    private constant: Constant,
    private events: Events,
  ) { }

  /*Dialogs and Loaders*/
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: UserPopoverComponent,
      event: ev,
      translucent: true,
      animated: true,
    });
    return await popover.present();
  }
  async presentPopoverHelp(ev: any) {
    const popover = await this.popoverController.create({
      component: HelpComponent,
      event: ev,
      translucent: true,
      animated: true,
    });
    return await popover.present();
  }
  /**Helper Functions */
  getAlignRight() {
    return this.translate.getDefaultLang() == 'en' ? '20px' : 'unset';
  }
  getAlignLeft() {
    return this.translate.getDefaultLang() == 'en' ? 'unset' : '20px';
  }
  getFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Futura-Medium' : 'Helvetica-Arabic-Medium';
  }
  getFontFamilyAlert(){
    return this.translate.getDefaultLang() == 'en' ? 'font-english' : 'font-arabic';
  }
  getButtonFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Helvetica-Arabic-Medium': 'Futura-Medium';
  }
  setLocalModel(_data) {
    let _laboratory = _data.SESSIONTOLABDATA.results;
    _.forEach(_laboratory, function (data) {
      data.dateFormattedStr = moment(data.Sdate.toString().replace(/\//g, "")).format("YYYY-MM-DD");
      data.dateFormatted = new Date(data.dateFormattedStr);
      data.lastDate = moment(data.Sdate.toString().replace(/\//g, "")).format("Do MMM YYYY");
    });

    _laboratory = _.sortBy(_laboratory, 'dateFormatted').reverse();

    let _radiology = _data.SESSIONTORADDATA.results;
    _.forEach(_radiology, function (data) {
      data.dateFormattedStr = moment(data.Edate.toString().replace(/\//g, "")).format("YYYY-MM-DD");
      data.dateFormatted = new Date(data.dateFormattedStr);
      data.lastDate = moment(data.Edate.toString().replace(/\//g, "")).format("Do MMM YYYY");
    });
    //debugger;
    _radiology = _.sortBy(_radiology, 'dateFormatted').reverse();

    let _nutrition = _data.SESSIONTONUTCARE.results;
    _.forEach(_nutrition, function (data) {
      data.dateFormattedStr = moment(data.Ddate.toString().replace(/\//g, "")).format("YYYY-MM-DD");
      data.dateFormatted = new Date(data.dateFormattedStr);
      data.lastDate = moment(data.Ddate.toString().replace(/\//g, "")).format("Do MMM YYYY");
    });
    //debugger;
    _nutrition = _.sortBy(_nutrition, 'dateFormatted').reverse();

    let _medReports = _data.SESSIONTOMEDREP.results;
    _.forEach(_medReports, function (data) {
      data.dateFormattedStr = moment(data.Ddate.toString().replace(/\//g, "")).format("YYYY-MM-DD");
      data.dateFormatted = new Date(data.dateFormattedStr);
      data.lastDate = moment(data.Ddate.toString().replace(/\//g, "")).format("Do MMM YYYY");
    });
    //debugger;
    _medReports = _.sortBy(_medReports, 'dateFormatted').reverse();

    this.model.laboratoryCount = _laboratory.length;
    this.model.laboratoryLastDate = _laboratory.length > 0 ? _laboratory[0].lastDate : '-';
    this.model.radiologyCount = _radiology.length;
    this.model.radiologyLastDate = _radiology.length > 0 ? _radiology[0].lastDate : '-';
    this.model.nutritionCount = _nutrition.length;
    this.model.nutritionLastDate = _nutrition.length > 0 ? _nutrition[0].lastDate : '-';
    this.model.medicalCount = _medReports.length;
    this.model.medicalLastDate = _medReports.length > 0 ? _medReports[0].lastDate : '-';

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
        let _object = {};
        this.events.publish('session-expired',_object);
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
        let _object = {};
        this.events.publish('session-expired',_object);
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
  /*Default Methods*/
  ngOnInit() {
    let msg = this.translate.instant('dialog_title_loading');
    //this._loader.showLoader(msg);
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;

    //this._loadData();

    this.model.laboratoryCount = 0;
    this.model.nutritionCount = 0;
    this.model.radiologyCount = 0;
    this.model.medicalCount = 0;
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    this.tiles.push(
      { id: 1, title: 'Laboratory', subtitle: 'Access to the laboratory reports', icon: 'icon-flask.svg', class: '', pendingDocuments: '', lastDate: '' },
      { id: 2, title: 'Nutrition', subtitle: 'Access to the nutrition care reports', icon: 'icon-nutrition.svg', class: '', pendingDocuments: '', lastDate: '' },
      { id: 3, title: 'Radiology', subtitle: 'Access to the radiology reports and images', icon: 'icon-radiology.svg', class: '', pendingDocuments: '', lastDate: '' },
      { id: 4, title: 'Medical Reports', subtitle: 'Access General Medical Reports, ER and Hospital Discharge reports', icon: 'icon-report.svg', class: '', pendingDocuments: '', lastDate: '' },
    );

    this.translate.onLangChange.subscribe((event:LangChangeEvent)=>{
      this.model.language = event.lang == 'en' ? true : false;
    })

  }
  ionViewDidEnter() {
    let msg = this.translate.instant('dialog_title_loading');
    this._loader.showLoader(msg);
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
    this._loadData();

    this.model.laboratoryCount = 0;
    this.model.nutritionCount = 0;
    this.model.radiologyCount = 0;
    this.model.medicalCount = 0;
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    this.tiles.push(
      { id: 1, title: 'Laboratory', subtitle: 'Access to the laboratory reports', icon: 'icon-flask.svg', class: '', pendingDocuments: '', lastDate: '' },
      { id: 2, title: 'Nutrition', subtitle: 'Access to the nutrition care reports', icon: 'icon-nutrition.svg', class: '', pendingDocuments: '', lastDate: '' },
      { id: 3, title: 'Radiology', subtitle: 'Access to the radiology reports and images', icon: 'icon-radiology.svg', class: '', pendingDocuments: '', lastDate: '' },
      { id: 4, title: 'Medical Reports', subtitle: 'Access General Medical Reports, ER and Hospital Discharge reports', icon: 'icon-report.svg', class: '', pendingDocuments: '', lastDate: '' },
    );

    this.translate.onLangChange.subscribe((event:LangChangeEvent)=>{
      this.model.language = event.lang == 'en' ? true : false;
    })
  }
  /**Data API */
  _loadData() {
    let that = this;
    let _param = {
      Patnr: that._api.getLocal('username'),
      Token: that._api.getLocal('token'),
      //Password:that._api.getLocal('password')
    }

    that._dataServices.loadData('SESSIONSET', _param, null, false, ['SESSIONTOLABDATA', 'SESSIONTORADDATA', 'SESSIONTONUTCARE', 'SESSIONTOMEDREP'], true).subscribe(
      _success => {
        that._loader.hideLoader();
        let _obj = _success.d;

        this.constant.firstName = _obj.Vname;
        this.constant.lastName = _obj.Nname;
        this.constant.email = _obj.Emailid;
        this.constant.mrn = _obj.Patnr;

        this._api.setLocal('firstName',_obj.Vname);
        this._api.setLocal('lastName',_obj.Nname);
        this._api.setLocal('email',_obj.Emailid);
        this._api.setLocal('mrn',_obj.Patnr);
        this._api.setLocal('helpPhone',_obj.HelpPhone);
        this._api.setLocal('helpEmail',_obj.HelpEmail);

        this.events.publish('user-data',_obj);
        this.events.publish('help-data',_obj);

        that._dataServices.setData(_obj.Token, _obj);
        //console.log(that._dataServices.getData(_obj.Token));
        that.setLocalModel(that._dataServices.getData(_obj.Token));
      }, _error => {
        that._loader.hideLoader();
        let errorObj = JSON.parse(_error._body);
        Swal.fire({
          title: this.translate.instant('lbl_error'),//errorObj.error.code,
          text: errorObj.error.message.value,
          customClass:{
            title:that.getFontFamilyAlert(),
            header:that.getFontFamilyAlert(),
            content: that.getFontFamilyAlert(),
            container: that.getFontFamilyAlert(),
            confirmButton: that.getFontFamilyAlert(),
          },
          backdrop:false,
          icon:'error',
          confirmButtonColor:'rgb(87,143,182)',
          confirmButtonText: this.translate.instant('lbl_filter_ok')
        }).then((result)=>{
           that.deleteSession();
        });
        // Swal.fire(errorObj.error.code, errorObj.error.message.value, 'error').then((result) => {
        //   //that.deleteSession();
        // });
      }
    )



  }
  /**Screen Interaction*/
  openProfile(event) {
    this.presentPopover(event);
  }
  openHelp(event){
    this.presentPopoverHelp(event);
  }
  switchLanguage(){
    this.model.language ? this.translate.use('en') : this.translate.use('ar');
    this.model.language ? this.translate.setDefaultLang('en') : this.translate.setDefaultLang('ar');
    this._api.setLocal('lang',this.model.language);
  }
  changeLanguage(){
    if(this.translate.getDefaultLang()=='en'){
      this.translate.use('ar');
      this.translate.setDefaultLang('ar');
    }
    else{
      this.translate.use('en');
      this.translate.setDefaultLang('en');
    }
  }
  goTo(param){
    let that = this;
    switch(param){
      case 'nutrition':
        if(Number(this.model.nutritionCount)>0){
          this.router.navigateByUrl(param);
        }
        else{
          Swal.fire({
            title: this.translate.instant('lbl_no_data'),
            text: this.translate.instant('lbl_no_data_msg'),
            backdrop:false,
            customClass:{
              title:that.getFontFamilyAlert(),
              header:that.getFontFamilyAlert(),
              content: that.getFontFamilyAlert(),
              container: that.getFontFamilyAlert(),
              confirmButton: that.getFontFamilyAlert(),
            },
            icon:'info',
            confirmButtonColor:'rgb(87,143,182)',
            confirmButtonText: this.translate.instant('lbl_filter_ok')
          });
          //Swal.fire(this.translate.instant('lbl_no_data'), this.translate.instant('lbl_no_data_msg'), 'info');
        }
        break;
      case 'radiology':
        if(Number(this.model.radiologyCount)>0){
          this.router.navigateByUrl(param);
        }
        else{
          Swal.fire({
            title: this.translate.instant('lbl_no_data'),
            text: this.translate.instant('lbl_no_data_msg'),
            backdrop:false,
            customClass:{
              title:that.getFontFamilyAlert(),
              header:that.getFontFamilyAlert(),
              content: that.getFontFamilyAlert(),
              container: that.getFontFamilyAlert(),
              confirmButton: that.getFontFamilyAlert(),
            },
            icon:'info',
            confirmButtonColor:'rgb(87,143,182)',
            confirmButtonText: this.translate.instant('lbl_filter_ok')
          });
          // Swal.fire(this.translate.instant('lbl_no_data'), this.translate.instant('lbl_no_data_msg'), 'info').then((result) => {
            
          // });
        }
        break;
      case 'laboratory':
        if(Number(this.model.laboratoryCount)>0){
          this.router.navigateByUrl(param);
        }
        else{
          Swal.fire({
            title: this.translate.instant('lbl_no_data'),
            text: this.translate.instant('lbl_no_data_msg'),
            backdrop:false,
            customClass:{
              title:that.getFontFamilyAlert(),
              header:that.getFontFamilyAlert(),
              content: that.getFontFamilyAlert(),
              container: that.getFontFamilyAlert(),
              confirmButton: that.getFontFamilyAlert(),
            },
            icon:'info',
            confirmButtonColor:'rgb(87,143,182)',
            confirmButtonText: this.translate.instant('lbl_filter_ok')
          });
          // Swal.fire(this.translate.instant('lbl_no_data'), this.translate.instant('lbl_no_data_msg'), 'info').then((result) => {
            
          // });
        }
        break;
      case 'medical-reports':
        if(Number(this.model.medicalCount)>0){
          this.router.navigateByUrl(param);
        }
        else{
          Swal.fire({
            title: this.translate.instant('lbl_no_data'),
            text: this.translate.instant('lbl_no_data_msg'),
            backdrop:false,
            customClass:{
              title:that.getFontFamilyAlert(),
              header:that.getFontFamilyAlert(),
              content: that.getFontFamilyAlert(),
              container: that.getFontFamilyAlert(),
              confirmButton: that.getFontFamilyAlert(),
            },
            icon:'info',
            confirmButtonColor:'rgb(87,143,182)',
            confirmButtonText: this.translate.instant('lbl_filter_ok')
          });
          // Swal.fire(this.translate.instant('lbl_no_data'), this.translate.instant('lbl_no_data_msg'), 'info').then((result) => {
            
          // });
        }
        break;    
    }
    
  }
}
