import { Component, OnInit, TemplateRef } from '@angular/core';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { environment } from '../../environments/environment';
import { BnNgIdleService } from 'bn-ng-idle';
import { DataService } from './../services/data.service';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, Platform, ModalController, PopoverController } from '@ionic/angular';
import { GlobalService } from './../services/global.service';
import { finalize } from 'rxjs/operators';
import { from } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Constant } from '../constant';
import { CustomAlertComponent } from './../custom-alert/custom-alert.component';
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { TermsConditionsComponent } from './../terms-conditions/terms-conditions.component';
import Swal from 'sweetalert2';
import { Events } from './../services/event.service';
import { Storage } from '@ionic/storage';
import { InstructionComponent } from './../instruction/instruction.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  model: any = {};
  returnUrl: string;
  baseUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _loader: LoaderService,
    public alertController: AlertController,
    private _api: ApiService,
    private bnIdle: BnNgIdleService,
    private _dataServices: DataService,
    private global: GlobalService,
    private http: HttpClient,
    private nativeHttp: HTTP,
    private platform: Platform,
    private translate: TranslateService,
    private constant: Constant,
    private modalController: ModalController,
    private events: Events,
    private storage: Storage,
    public popoverController: PopoverController,
  ) {
    this.baseUrl = environment.url;
  }

  /**Dialogs and Loaders */
  async openModalTermsConditions(_base64, _patnr, _token, _password, _termsCond, isChangePassword) {
    const modal = await this.modalController.create({
      component: TermsConditionsComponent,
      backdropDismiss: false,
      componentProps: { data: _base64, patnr: _patnr, token: _token, password: _password, termsCond: _termsCond, isChangePassword: isChangePassword },
      cssClass: 'pdfViewer',

    });
    modal.onDidDismiss().then((data) => {
      if (data.data.isChangePassword) {
        this.openModalChangePassword();
      }
      else {

      }
    });
    return await modal.present();
  }
  async openModalTermsConditionsMobile(_base64, _patnr, _token, _password, _termsCond, isChangePassword) {
    const modal = await this.modalController.create({
      component: TermsConditionsComponent,
      backdropDismiss: false,
      componentProps: { data: _base64, patnr: _patnr, token: _token, password: _password, termsCond: _termsCond, isChangePassword: isChangePassword },
    });
    modal.onDidDismiss().then((data) => {
      if (data.data.isChangePassword) {
        this.openModalChangePassword();
      }
      else {

      }
    });
    return await modal.present();
  }

  async openModalChangePassword() {
    const modal = await this.modalController.create({
      component: CustomAlertComponent,
      backdropDismiss: false,
      componentProps: { viewName: 'Login' },
    });
    modal.onDidDismiss().then((data) => {
      if (data.data.goToHome) {
        this.model = {};
        this.router.navigateByUrl('home');
      }
      else {
        console.log("I am here from dismiss");
        this.deleteSession();
      }
    })
    return await modal.present();
  }

  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [{
        text: 'Ok',
        handler: (val) => {
          // if (title == "SessionExpired") {
          //   this.router.navigateByUrl('login');
          // }
        }
      }]
    });
    await alert.present();
  }
  async presentAlertCustom(title, message) {
    const modal = await this.modalController.create({
      component: CustomAlertComponent,
      backdropDismiss: false,
      componentProps: {},
    });
    return await modal.present();
  }
  async presentForgotDialog() {
    const modal = await this.modalController.create({
      component: ForgotPasswordComponent,
      backdropDismiss: false,
      componentProps: {},
    });
    return await modal.present();
  }
  async presentPopoverHelp(ev: any,data) {
    const popover = await this.popoverController.create({
      component: InstructionComponent,
      event: ev,
      componentProps: { instructionData: data },
      translucent: true,
      animated: true,
    });
    return await popover.present();
  }
  showAlertMessage(title, message) {
    this.presentAlert(title, message);
  }
  showCustomAlert() {
    this.presentAlertCustom('Test', 'Test');
  }
  /*Helper Functions* */
  getFontFamily() {
    return this.translate.getDefaultLang() == 'en' ? 'Futura-Medium' : 'Helvetica-Arabic-Medium';
  }
  getFontFamilyAlert() {
    return this.translate.getDefaultLang() == 'en' ? 'font-english' : 'font-arabic';
  }
  getFontSize() {
    return this.model.isVisible ? '0.90em' : '1.1em';
  }
  getMarginLeft(){
    return this.translate.getDefaultLang() == 'en' ? '0.5em' : '0em';
  }
  getMarginRight(){
    return this.translate.getDefaultLang() == 'en' ? '0em' : '0.5em';
  }
  getFontSizeLogo() {
    return this.model.isVisible ? '5em' : '6em';
  }
  getImageHeight(){
    return this.model.isVisible? '120%' : '100%';
  }
  getOverFlowScroll(){
    return this.model.isVisible?'scroll':'hidden';
  }
  getButtonFontFamily() {
    return this.translate.getDefaultLang() == 'en' ? 'Helvetica-Arabic-Medium' : 'Futura-Medium';
  }
  getPhoneNumberDirection() {
    return this.translate.getDefaultLang() == 'en' ? 'ltr' : 'rtl';
  }
  clearStorage() {
    this._api.remLocal('isLoggedIn');
    this._api.remLocal('token');
    this._api.remLocal('username');
    this._api.remLocal('sessionTimeout');
    this._api.remLocal('password');
    this._api.remLocal('firstName');
    this._api.remLocal('lastName');
    this._api.remLocal('email');
    this._api.remLocal('mrn');
    this._api.remLocal('helpPhone');
    this._api.remLocal('helpEmail');
  }
  getAlignmentClass() {
    return this.translate.getDefaultLang() == 'en' ? 'mobileToggle text-center p-t-90' : 'mobileToggleAR text-center p-t-90';
  }
  setLanguageModel() {
    this.translate.getDefaultLang() == 'en' ? this.model.language = this.translate.instant('lbl_lang_ar') : this.model.language = this.translate.instant('lbl_lang_en');
  }
  /*Default Methods*/
  ngOnInit() {
    this.clearStorage();
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    //this.translate.setDefaultLang('ar');  
    if (this.model.isVisible) {
      this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
    }

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log("Here");
      console.log(event.lang);
      this.translate.setDefaultLang(event.lang);
      this.translate.use(event.lang);
      this.model.language = event.lang == 'en' ? true : false;
    });
  }
  ionViewDidEnter() {
    this.clearStorage();
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    if (this.model.isVisible) {
      this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
    }
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log("Here1");
      console.log(event.lang);
      this.model.language = event.lang == 'en' ? true : false;
    });
  }
  /**Screen Interactions */
  openHelp(event) {
    this.getInstructions(event);
  }
  forgotPassword() {
    this.presentForgotDialog();
  }
  onLogin() {
    this._api.setLocal('isLoggedIn', true);
    let _obj = {};
    this.events.publish('reset-timer', _obj);
    this.model = {};
    this.router.navigateByUrl('home');
  }
  login() {
    let that = this;
    if (this.model.username && this.model.password) {
      // let msg = this.translate.instant('dialog_title_authentication');
      // this._loader.showLoader(msg);
      this.doLogin();
    }
    else {
      Swal.fire({
        title: this.translate.instant('lbl_missing_data'),
        text: this.translate.instant('lbl_missing_data_message'),
        customClass: {
          title: that.getFontFamilyAlert(),
          header: that.getFontFamilyAlert(),
          content: that.getFontFamilyAlert(),
          container: that.getFontFamilyAlert(),
          confirmButton: that.getFontFamilyAlert(),
        },
        backdrop: false,
        icon: 'warning',
        confirmButtonColor: 'rgb(87,143,182)',
        confirmButtonText: this.translate.instant('lbl_filter_ok')
      });
    }
    // this.showCustomAlert()
  }
  switchLanguage() {
    //console.log(this.model.language);
    if (this.translate.getDefaultLang() == 'en') {
      this.translate.use('ar');
      this.translate.setDefaultLang('ar');
      //this.setLanguageModel();
    }
    else {
      this.translate.use('en');
      this.translate.setDefaultLang('en');
      //this.setLanguageModel();
    }
  }
  changeLanguage() {
    console.log(this.model.language);
    if (this.model.language != undefined) {
      this.model.language ? this.translate.use('en') : this.translate.use('ar');
      this.model.language ? this.translate.setDefaultLang('en') : this.translate.setDefaultLang('ar');
      console.log(this.translate.getDefaultLang());
      console.log(this.translate.getBrowserLang());
    }

  }

  getInstructions(event) {
    let that = this;
    let filters = {
      SPRAS: that.translate.getDefaultLang().toUpperCase(),
    }



    that._dataServices.loadData('PORTALINSTRUCTIONSSET', null, filters, false, null, false).subscribe(
      _success => {
        console.log(_success);
        that.presentPopoverHelp(event,_success.d.results);
        //that.openDocument(_obj.PDFData,_documentNo);

      }, _error => {

        //this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )
  }
  doLogin() {
    let that = this;
    let msg = this.translate.instant('dialog_title_authentication');
    this._loader.showLoader(msg);
    let _data = {
      Patnr: this.model.username,
      Password: this.model.password,
    }
    //that.loginUser("LOGINSESSIONSET",_data);
    that._dataServices.login(_data).subscribe(
      _success => {
        let _obj = _success.d;
        that._loader.hideLoader();
        this._api.setLocal('isLoggedIn', true);
        this._api.setLocal('token', _obj.Token);
        this._api.setLocal('username', that.model.username);
        this._api.setLocal('sessionTimeout', _obj.BrowserTimeout);
        //this._api.setLocal('password', that.model.password);
        this.constant.sessionTimeOut = _obj.BrowserTimeout / 10;
        //console.log(this.constant.sessionTimeOut);

        this.events.publish('session-data', _obj);

        let _object = {};
        this.events.publish('reset-timer', _object);
        
        if (_obj.PendingTermCond == 'X') {
          if (_obj.SysPswd == 'X') {
            that.loadTermsConditions(that.model.username, _obj.Token, that.model.password, true);
          }
          else {
            that.loadTermsConditions(that.model.username, _obj.Token, that.model.password, false);
          }
        }
        else if (_obj.SysPswd == 'X') {
          that.openModalChangePassword();
        }
        else {
          that.model = {};
          this.router.navigateByUrl('home');
        }
      }, _error => {
        that._loader.hideLoader();
        if (_error.status == 0) {
          Swal.fire({
            title: this.translate.instant('lbl_server_unavailable_title'),//errorObj.error.code,
            text: this.translate.instant('lbl_server_unavailable'),
            backdrop: false,
            customClass: {
              title: that.getFontFamilyAlert(),
              header: that.getFontFamilyAlert(),
              content: that.getFontFamilyAlert(),
              container: that.getFontFamilyAlert(),
              confirmButton: that.getFontFamilyAlert(),
            },
            icon: 'warning',
            confirmButtonColor: 'rgb(87,143,182)',
            confirmButtonText: this.translate.instant('lbl_filter_ok')
          });
        }
        else {
          let _errorResponse = JSON.parse(_error._body);
          let errorObj = JSON.parse(_error._body);
          Swal.fire({
            title: this.translate.instant('lbl_error'),//errorObj.error.code,
            text: errorObj.error.message.value,
            customClass: {
              title: that.getFontFamilyAlert(),
              header: that.getFontFamilyAlert(),
              content: that.getFontFamilyAlert(),
              container: that.getFontFamilyAlert(),
              confirmButton: that.getFontFamilyAlert(),

            },
            backdrop: false,
            icon: 'error',
            confirmButtonColor: 'rgb(87,143,182)',
            confirmButtonText: this.translate.instant('lbl_filter_ok')
          });
        }

        //Swal.fire(errorObj.error.code, errorObj.error.message.value, 'error')
        //this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )
  }
  deleteSession() {
    let that = this;
    let msg = '';
    this._loader.showLoader(msg);


    let _param = {
      Patnr: that._api.getLocal('username'),
      Token: that._api.getLocal('token'),
      //Password:that._api.getLocal('password')
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
        this._api.remLocal('helpPhone');
        this._api.remLocal('helpEmail');
        let _obj = {
          'isLogOut': true
        };
        this.events.publish('stop-timer', _obj);
        // window.location.reload();
        this.translate.resetLang(this.translate.getBrowserLang());
        this.model = {};
        this.router.navigateByUrl('login');
        this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
          : this.model.isVisible = false;
        if (this.model.isVisible) {
          this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
        }
        window.location.reload();

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
        this._api.remLocal('helpPhone');
        this._api.remLocal('helpEmail');
        let _obj = {
          'isLogOut': true
        };
        this.translate.resetLang(this.translate.getBrowserLang());
        this.events.publish('stop-timer', _obj);
        // window.location.reload();
        this.model = {};
        this.router.navigateByUrl('login');
        this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
          : this.model.isVisible = false;
        if (this.model.isVisible) {
          this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
        }
        window.location.reload();
      }
    )
  }
  loadTermsConditions(_username, _token, _password, isChangePassword) {
    let that = this;
    let _param = {
      Patnr: _username,
      Token: _token,
      //Password: _password,
    }

    that._dataServices.loadData('TERMSCONDSET', _param, null, false, null, false).subscribe(
      _success => {
        //that._loader.hideLoader();
        let _obj = _success.d;
        //console.log(_obj);
        if (that.model.isVisible) {
          that.model = {};
          this.openModalTermsConditionsMobile(_obj.PDFData, _username, _token, _password, _obj.TermCond, isChangePassword);
        }
        else {
          that.model = {};
          that.openModalTermsConditions(_obj.PDFData, _username, _token, _password, _obj.TermCond, isChangePassword);
        }

      }, _error => {
        //that._loader.hideLoader();
        let _errorResponse = JSON.parse(_error._body);
        this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )

  }

}
