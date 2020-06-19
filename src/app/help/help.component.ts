import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Events } from './../services/event.service';
import { ApiService } from './../services/api.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  model: any = {}
  constructor(
    private translate: TranslateService,
    private events: Events,
    private _api: ApiService,
    private platform: Platform,
  ) { }

  getFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Futura-Medium' : 'Helvetica-Arabic-Medium';
  }

  getFontSize(){
    return this.model.isVisible? '0.75em' : '1em';
  }

  getPhoneNumberDirection(){
    return this.translate.getDefaultLang() == 'en' ? 'ltr' : 'ltr';
  }
  
  ngOnInit() {
    this.events.subscribe('help-data', (_data: any) => {
      this.model.helpEmail = _data.HelpEmail;
      this.model.helpPhone = _data.HelpPhone;
    })
    this.model.helpEmail = this._api.getLocal('helpEmail');;
    this.model.helpPhone = this._api.getLocal('helpPhone');;

    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;

  }

  ionViewDidEnter(){
    this.events.subscribe('help-data', (_data: any) => {
      this.model.helpEmail = _data.HelpEmail;
      this.model.helpPhone = _data.HelpPhone;
    })
    this.model.helpEmail = this._api.getLocal('helpEmail');;
    this.model.helpPhone = this._api.getLocal('helpPhone');;
  }

}
