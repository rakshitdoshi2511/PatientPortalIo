import { Component, OnInit, TemplateRef } from '@angular/core';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { environment } from '../../environments/environment';
import { BnNgIdleService } from 'bn-ng-idle';
import { DataService } from './../services/data.service';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController,Platform } from '@ionic/angular';
import { GlobalService } from './../services/global.service';
import { finalize } from 'rxjs/operators';
import { from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
    private global:GlobalService,
    private http:HttpClient,
    private nativeHttp:HTTP,
    private platform:Platform,
    private translate: TranslateService,

  ) {
    this.baseUrl = environment.url;
   }
  
   /**Dialogs and Loaders */
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
  showAlertMessage(title, message) {
    this.presentAlert(title, message);
  }
   /*Helper Functions* */
  clearStorage() {
    this._api.remLocal('isLoggedIn');
    this._api.remLocal('token');
    this._api.remLocal('username');
  }
  /*Default Methods*/
  ngOnInit() {
    this.clearStorage();
  }
  ionViewDidEnter() {
    this.clearStorage();
  }
  /**Screen Interactions */
  onLogin() {
    this._api.setLocal('isLoggedIn', true);
    this.bnIdle.resetTimer();
    this.router.navigateByUrl('home');
  }
  login(){
    let msg = this.translate.instant('dialog_title_authentication');
    this._loader.showLoader(msg);

    this.doLogin();
  }
  doLogin(){
    let that = this;
    let _data = {
      Patnr:this.model.username,
      Password:this.model.password,
    }
    //that.loginUser("LOGINSESSIONSET",_data);
    that._dataServices.login(_data).subscribe(
      _success=>{
        let _obj = _success.d;
        this._api.setLocal('isLoggedIn', true);
        this._api.setLocal('token', _obj.Token);
        this._api.setLocal('username',that.model.username);
        this._api.setLocal('sessionTimeout',_obj.BrowserTimeout);
        this.global.sessionTimeout = _obj.BrowserTimeout/10;
        this.bnIdle.resetTimer();
        that._loader.hideLoader();
        this.router.navigateByUrl('home');
      },_error=>{
        that._loader.hideLoader();
        let _errorResponse = JSON.parse(_error._body);
        this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )
  }

}
