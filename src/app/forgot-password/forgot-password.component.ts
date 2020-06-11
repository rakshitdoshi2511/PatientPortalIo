import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoaderService } from '../services/loader.service';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  model: any = {};
  constructor(
    private modalController: ModalController,
    private _loader: LoaderService,
    private _api: ApiService,
    private _dataServices: DataService,
    private translate: TranslateService,
  ) { }

  ngOnInit() { }
  dismiss() {
    this.modalController.dismiss();
  }
  forgotPassword() {
    if (this.model.username && this.model.email) {
      let msg = this.translate.instant('dialog_title_reset');
      this._loader.showLoader(msg);
      this.doForgotPassword();
    }
    else {
      Swal.fire({
        title: this.translate.instant('lbl_missing_data'),
        text: this.translate.instant('lbl_missing_data_message'),
        backdrop:false,
        icon:'warning',
        confirmButtonColor: 'rgb(87,143,182)'
      });
    }
  }
  doForgotPassword() {
    let that = this;
    let _data = {
      Patnr: this.model.username,
      EmailID: this.model.email,
    }

    that._dataServices.postData('FORGOTPASSSWORDSET', _data).subscribe(
      _success => {
        that._loader.hideLoader();
        Swal.fire({
          title: this.translate.instant('lbl_email_sent'),
          text: this.translate.instant('lbl_email_sent_message'),
          backdrop: false,
          icon: 'success',
          confirmButtonColor: 'rgb(87,143,182)'
        }).then((result)=>{
          that.modalController.dismiss();
        });
      }, _error => {
        that._loader.hideLoader();
        let errorObj = JSON.parse(_error._body);
        Swal.fire({
          title: this.translate.instant('lbl_error'),//errorObj.error.code,
          text: errorObj.error.message.value,
          backdrop: false,
          icon: 'error',
          confirmButtonColor: 'rgb(87,143,182)'
        });
      }
    )
  }

}
