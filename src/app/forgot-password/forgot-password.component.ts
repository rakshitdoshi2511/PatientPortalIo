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
  getFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Futura-Medium' : 'Helvetica-Arabic-Medium';
  }
  getFontFamilyAlert(){
    return this.translate.getDefaultLang() == 'en' ? 'font-english' : 'font-arabic';
  }
  forgotPassword() {
    let that = this;
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
        customClass:{
          title:that.getFontFamilyAlert(),
          header:that.getFontFamilyAlert(),
          content: that.getFontFamilyAlert(),
          container: that.getFontFamilyAlert(),
          confirmButton: that.getFontFamilyAlert(),
          
         },
        icon:'warning',
        confirmButtonColor: 'rgb(87,143,182)',
        confirmButtonText: this.translate.instant('lbl_filter_ok')
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
          customClass:{
            title:that.getFontFamilyAlert(),
            header:that.getFontFamilyAlert(),
            content: that.getFontFamilyAlert(),
            container: that.getFontFamilyAlert(),
            confirmButton: that.getFontFamilyAlert(),
            
           },
          icon: 'success',
          confirmButtonColor: 'rgb(87,143,182)',
          confirmButtonText: this.translate.instant('lbl_filter_ok')
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
          customClass:{
            title:that.getFontFamilyAlert(),
            header:that.getFontFamilyAlert(),
            content: that.getFontFamilyAlert(),
            container: that.getFontFamilyAlert(),
            confirmButton: that.getFontFamilyAlert(),
           },
          icon: 'error',
          confirmButtonColor: 'rgb(87,143,182)',
          confirmButtonText: this.translate.instant('lbl_filter_ok')
        });
      }
    )
  }

}
