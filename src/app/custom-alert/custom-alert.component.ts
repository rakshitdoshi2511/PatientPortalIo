import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../services/data.service';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.scss'],
})
export class CustomAlertComponent implements OnInit {
  model: any = {}
  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private _dataServices: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private _loader: LoaderService,
    private _api: ApiService,
    private storage: Storage,
  ) { }

  ngOnInit() {}

  /**Screen Interaction */
  dismiss() {
    this.modalController.dismiss();
  }

  resetPassword(){
    let that = this;
    console.log(this.model.newPassword);
    console.log(this.model.repeatPassword);
    if(this.model.newPassword && this.model.repeatPassword){
      if(this.model.newPassword === this.model.repeatPassword){
        let msg = this.translate.instant('dialog_title_changepassword');
        that._loader.showLoader(msg);
        that.doPasswordChange();
      }
      else{
        Swal.fire({
          title: this.translate.instant('lbl_password_mismatch'),
          text: this.translate.instant('lbl_password_mismatch_message'),
          backdrop:false,
          icon:'warning'
        });
       // Swal.fire(this.translate.instant('lbl_password_mismatch'), this.translate.instant('lbl_password_mismatch_message'), 'warning'); 
      }
    }
    else{
      Swal.fire({
        title: this.translate.instant('lbl_missing_data'),
        text: this.translate.instant('lbl_missing_data_message'),
        backdrop:false,
        icon:'warning'
      });
      //Swal.fire(this.translate.instant('lbl_missing_data'), this.translate.instant('lbl_missing_data_message'), 'warning'); 
    }
  }

  /**Data API */
  logOut() {
    this.deleteSession();
  }
  deleteSession() {
    let that = this;
    let msg = this.translate.instant('dialog_title_logout');
    this._loader.showLoader(msg);

    let _param = {
      Patnr: that._api.getLocal('username'),
      Token: that._api.getLocal('token'),
      Password:that._api.getLocal('password')
    }

    that._dataServices.deleteSession('SESSIONSET', _param, null, false, null, false).subscribe(
      _success => {
        that._loader.hideLoader();
        
        this.storage.clear();
        this._api.remLocal('isLoggedIn');
        this._api.remLocal('token');
        this._api.remLocal('username');
        window.location.reload();

      }, _error => {
        that._loader.hideLoader();
        
        this.storage.clear();
        this._api.remLocal('isLoggedIn');
        this._api.remLocal('token');
        this._api.remLocal('username');
        this._api.remLocal('sessionTimeout');
        window.location.reload();
      }
    )
  }
  doPasswordChange(){
    let that = this;
    let _data = {
      Patnr:this._api.getLocal('username'),
      Token:this._api.getLocal('token'),
      Password: this._api.getLocal('password'),
      NewPassword: this.model.newPassword
    }
    //that.loginUser("LOGINSESSIONSET",_data);
    that._dataServices.changePassword(_data).subscribe(
      _success=>{
       that._loader.hideLoader();
       Swal.fire({
        title: this.translate.instant('lbl_password_changed'),
        text: this.translate.instant('lbl_password_changed_message'),
        backdrop:false,
        icon:'success'
      }).then((result)=>{
        that.logOut();
      });

      //  Swal.fire(that.translate.instant('lbl_password_changed'),that.translate.instant('lbl_password_changed_message'),'success').then((result)=>{
      //     that.logOut();
      //  });
      },_error=>{
        that._loader.hideLoader();
        let _errorResponse = JSON.parse(_error._body);
        let errorObj = JSON.parse(_error._body);
        Swal.fire({
          title: errorObj.error.code,
          text: errorObj.error.message.value,
          backdrop:false,
          icon:'error'
        });
        //Swal.fire(errorObj.error.code, errorObj.error.message.value, 'error')
        //this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )
  }
}
