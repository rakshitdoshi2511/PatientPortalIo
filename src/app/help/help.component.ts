import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Events } from './../services/event.service';
import { ApiService } from './../services/api.service';

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
  ) { }

  ngOnInit() {
    this.events.subscribe('help-data', (_data: any) => {
      this.model.helpEmail = _data.HelpEmail;
      this.model.helpPhone = _data.HelpPhone;
    })
    this.model.helpEmail = this._api.getLocal('helpEmail');;
    this.model.helpPhone = this._api.getLocal('helpPhone');;
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
