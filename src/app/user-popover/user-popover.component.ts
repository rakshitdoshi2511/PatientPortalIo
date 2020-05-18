import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController,AlertController } from '@ionic/angular';
import { DataService } from './../services/data.service';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import * as moment from 'moment';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent implements OnInit {

  model: any = {};
  constructor(
    private translate: TranslateService,
    public popoverControl: PopoverController,
    private _api: ApiService,
    private storage: Storage,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    let that = this;
    this.model.language = this.translate.getDefaultLang() == 'en'? true: false;
    that.storage.get(that._api.getLocal('token')).then((val)=>{
      let _data = val;
      console.log(_data);
      if(Object.keys(_data).length>0){
        this.model.firstName = _data.Vname;
        this.model.lastName = _data.Nname;
        this.model.mrn = _data.Patnr;
        this.model.age = _data.Age;
        this.model.sex = _data.Sex;
        this.model.birthDate = moment(_data.Gbdat.toString().replace(/\//g, "")).format("DD.MM.YYYY");
        this.model.contact = '';
      }
      
    });
  }
  resetPassword(){}
  logOut(){}
  switchLanguage(){
    console.log(this.model.language);
    this.popoverControl.dismiss();
    this.model.language?this.translate.use('en'):this.translate.use('ar');
    this.model.language?this.translate.setDefaultLang('en'):this.translate.setDefaultLang('ar');
  }

}
