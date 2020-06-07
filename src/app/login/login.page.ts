import { Component, OnInit, TemplateRef } from '@angular/core';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { environment } from '../../environments/environment';
import { BnNgIdleService } from 'bn-ng-idle';
import { DataService } from './../services/data.service';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, Platform, ModalController } from '@ionic/angular';
import { GlobalService } from './../services/global.service';
import { finalize } from 'rxjs/operators';
import { from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Constant } from '../constant';
import { CustomAlertComponent } from './../custom-alert/custom-alert.component';
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { TermsConditionsComponent } from './../terms-conditions/terms-conditions.component';
import Swal from 'sweetalert2';
import { Events } from './../services/event.service'; 

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

  ) {
    this.baseUrl = environment.url;
  }

  /**Dialogs and Loaders */
  async openModalTermsConditions(_base64, _patnr, _token, _password, _termsCond) {
    const modal = await this.modalController.create({
      component: TermsConditionsComponent,
      backdropDismiss: false,
      componentProps: { data: _base64, patnr: _patnr, token: _token, password: _password, termsCond: _termsCond },
      cssClass: 'pdfViewer',

    });
    return await modal.present();
  }
  async openModalTermsConditionsMobile(_base64, _patnr, _token, _password, _termsCond) {
    const modal = await this.modalController.create({
      component: TermsConditionsComponent,
      backdropDismiss: false,
      componentProps: { data: _base64, patnr: _patnr, token: _token, password: _password, termsCond: _termsCond },
    });
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
  showAlertMessage(title, message) {
    this.presentAlert(title, message);
  }
  showCustomAlert() {
    this.presentAlertCustom('Test', 'Test');
  }
  /*Helper Functions* */
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
  }
  /*Default Methods*/
  ngOnInit() {
    this.clearStorage();
  }
  ionViewDidEnter() {
    this.clearStorage();
  }
  /**Screen Interactions */
  forgotPassword() {
    this.presentForgotDialog();
  }
  onLogin() {
    this._api.setLocal('isLoggedIn', true);
    this.bnIdle.resetTimer();
    this.router.navigateByUrl('home');
  }
  login() {
    if (this.model.username && this.model.password) {
      let msg = this.translate.instant('dialog_title_authentication');
      this._loader.showLoader(msg);
      this.doLogin();
    }
    else {
      Swal.fire({
        title: this.translate.instant('lbl_missing_data'),
        text: this.translate.instant('lbl_missing_data_message'),
        backdrop: false,
        icon: 'warning',
        confirmButtonColor: 'rgb(87,143,182)'
      });
    }
    // this.showCustomAlert()
  }
  doLogin() {
    let that = this;
    let _data = {
      Patnr: this.model.username,
      Password: this.model.password,
    }
    //that.loginUser("LOGINSESSIONSET",_data);
    that._dataServices.login(_data).subscribe(
      _success => {
        let _obj = _success.d;
        
        this._api.setLocal('isLoggedIn', true);
        this._api.setLocal('token', _obj.Token);
        this._api.setLocal('username', that.model.username);
        this._api.setLocal('sessionTimeout', _obj.BrowserTimeout);
        this._api.setLocal('password', that.model.password);
        this.constant.sessionTimeOut = _obj.BrowserTimeout / 10;
        //console.log(this.constant.sessionTimeOut);

        this.events.publish('session-data',_obj);

        this.bnIdle.resetTimer();
        that._loader.hideLoader();
        if (_obj.PendingTermCond == 'X') {
          that.loadTermsConditions(that.model.username, _obj.Token, that.model.password);
        }
        else {
          that.model = {};
          this.router.navigateByUrl('home');
        }
      }, _error => {
        that._loader.hideLoader();
        let _errorResponse = JSON.parse(_error._body);
        let errorObj = JSON.parse(_error._body);
        Swal.fire({
          title: errorObj.error.code,
          text: errorObj.error.message.value,
          backdrop: false,
          icon: 'error',
          confirmButtonColor: 'rgb(87,143,182)'
        });
        //Swal.fire(errorObj.error.code, errorObj.error.message.value, 'error')
        //this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )
  }
  loadTermsConditions(_username, _token, _password) {
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
          this.openModalTermsConditionsMobile(_obj.PDFData, _username, _token, _password, _obj.TermCond);
        }
        else {
          that.model = {};
          that.openModalTermsConditions(_obj.PDFData, _username, _token, _password, _obj.TermCond);
        }

      }, _error => {
        //that._loader.hideLoader();
        let _errorResponse = JSON.parse(_error._body);
        this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )

  }

}
