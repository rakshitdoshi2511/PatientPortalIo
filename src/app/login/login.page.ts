import { Component, OnInit, TemplateRef } from '@angular/core';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { environment } from '../../environments/environment';
import { BnNgIdleService } from 'bn-ng-idle';
import { DataService } from './../services/data.service';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController,Platform,ModalController } from '@ionic/angular';
import { GlobalService } from './../services/global.service';
import { finalize } from 'rxjs/operators';
import { from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Constant}  from '../constant';
import { CustomAlertComponent } from './../custom-alert/custom-alert.component';
import Swal from 'sweetalert2';

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
    private constant: Constant,
    private modalController: ModalController,

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
  async presentAlertCustom(title, message) {
    const modal = await this.modalController.create({
      component: CustomAlertComponent,
      backdropDismiss: false,
      componentProps: {},
    });
    return await modal.present();
  }
  showAlertMessage(title, message) {
    this.presentAlert(title, message);
  }
  showCustomAlert(){
    this.presentAlertCustom('Test','Test');
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

   // this.showCustomAlert()
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
        this.constant.sessionTimeOut = _obj.BrowserTimeout/10;
        console.log(this.constant.sessionTimeOut);
        
        this.bnIdle.resetTimer();
        that._loader.hideLoader();
        this.router.navigateByUrl('home');
      },_error=>{
        that._loader.hideLoader();
        let _errorResponse = JSON.parse(_error._body);
        let errorObj = JSON.parse(_error._body);
        Swal.fire(errorObj.error.code, errorObj.error.message.value, 'error')
        //this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )
  }

}
