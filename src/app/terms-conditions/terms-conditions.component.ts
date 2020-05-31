import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit {
  pdfSrc: any = "";
  pdfRaw: any = "";
  model: any = {};

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private translate: TranslateService,
    private platform: Platform,
    private router: Router,
    private _dataServices: DataService,
    private _api: ApiService,
    private storage: Storage,
  ) { }

  /**Helper Methods */
  base64ToArrayBuffer(base64) {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  b64toBlob(b64Data?: any, contentType?: any, sliceSize?: any) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  /**Default Method */
  ngOnInit() {
    let response = this.navParams.data.data;
    this.model.patnr = this.navParams.data.patnr;
    this.model.token = this.navParams.data.token;
    this.model.password = this.navParams.data.password;
    this.model.termsCond = this.navParams.data.termsCond;
    this.pdfSrc = this.base64ToArrayBuffer(response);
    this.pdfRaw = this.navParams.data.data;
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
  }

  /**Screen Interaction */
  agreeTerms(){
    let that = this;
    let _data = {
      Patnr: this.model.patnr,
      Token: this.model.token,
      //Password: this.model.password,
      ACCEPTED: 'X',
      // PDFData: this.pdfRaw,
      TermCond: this.model.termsCond,
      // Language: '',
    }
    let _params = {
      Patnr: this.model.patnr,
      Token: this.model.token,
      //Password: this.model.password,
    }
    
    //that.loginUser("LOGINSESSIONSET",_data);
    that._dataServices.updateData("TERMSCONDUPDSET",_data,_params,null,false,null,false).subscribe(
      _success => {
        debugger;
        that.modalController.dismiss();
        this.router.navigateByUrl('home');
      }, _error => {
        that.modalController.dismiss();
        debugger;
        
      }
    )
  }
  declineTerms(){
    // this.router.navigateByUrl('home');
    let that = this;
    let _data = {
      Patnr: this.model.patnr,
      Token: this.model.token,
      //Password: this.model.password,
      ACCEPTED: '',
      TermCond: this.model.termsCond,
    }
    let _params = {
      Patnr: this.model.patnr,
      Token: this.model.token,
      //Password: this.model.password,
    }
    
    //that.loginUser("LOGINSESSIONSET",_data);
    that._dataServices.updateData("TERMSCONDUPDSET",_data,_params,null,false,null,false).subscribe(
      _success => {
        that.modalController.dismiss();
        that.deleteSession();
      }, _error => {
        that.modalController.dismiss();
        that.deleteSession(); 
      }
    )
  }

  deleteSession() {
    let that = this;
    let _param = {
      Patnr: that._api.getLocal('username'),
      Token: that._api.getLocal('token'),
     // Password:that._api.getLocal('password')
    }

    that._dataServices.deleteSession('SESSIONSET', _param, null, false, null, false).subscribe(
      _success => {
        this.storage.clear();
        this._api.remLocal('isLoggedIn');
        this._api.remLocal('token');
        this._api.remLocal('username');
        this._api.remLocal('sessionTimeout');
        this._api.remLocal('password');
        this.router.navigateByUrl('login');
       // window.location.reload();

      }, _error => {
        this.storage.clear();
        this._api.remLocal('isLoggedIn');
        this._api.remLocal('token');
        this._api.remLocal('username');
        this._api.remLocal('sessionTimeout');
        this._api.remLocal('password');
        this.router.navigateByUrl('login');
        //window.location.reload();
      }
    )
  }

}
