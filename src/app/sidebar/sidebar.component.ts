import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './../services/api.service';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import {Storage} from '@ionic/storage';
import { PopoverController,AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  version: string = "";
  model: any = {};
  appPages: any = [];

  constructor(
    private _api: ApiService,
    private translate: TranslateService,
    private storage: Storage,
    public alertController: AlertController,
    ) { }

   /**Helper Methods*/
   getImagePath(p){
    return p.iconPath;
  } 
   /**Default Methods */ 
  ngOnInit() {
    let that = this;
    
    that.storage.get(that._api.getLocal('token')).then((val)=>{
      let _data = val;
      console.log(_data);
      if(_data!=null && Object.keys(_data).length>0){
        this.model.firstName = _data.Vname;
        this.model.lastName = _data.Nname;
        this.model.mrn = _data.Patnr;
        this.model.age = _data.Age;
        this.model.sex = _data.Sex;
        this.model.birthDate = moment(_data.Gbdat.toString().replace(/\//g, "")).format("DD.MM.YYYY");
        this.model.contact = '';
        this.model.email = _data.Emailid;
      }
    });
    let _pages = [
      { title: this.translate.instant('sidemenu_home'),url: '/home',iconName: 'home', iconPath: '../assets/icon/icon_home_blue.svg'},
      { title: this.translate.instant('sidemenu_lab'), url: "laboratory",iconName: 'card',iconPath: '../assets/icon/icon_flask_blue.svg'},
      { title: this.translate.instant('sidemenu_nutrition'),url: 'nutrition',iconName: 'person',iconPath: '../assets/icon/icon_nutrition_blue.svg'},
      { title: this.translate.instant('sidemenu_radiology'),url: 'radiology',iconName: 'notifications',iconPath: '../assets/icon/icon_radiology_blue.svg'},
      { title: this.translate.instant('sidemenu_medical'), url: 'medical-reports',iconName: 'notifications', iconPath: '../assets/icon/icon_report_blue.svg'}];
    this.appPages = _pages;
  }
  ionViewDidEnter(){
    let that = this;
    
    that.storage.get(that._api.getLocal('token')).then((val)=>{
      let _data = val;
      console.log(_data);
      if(_data!=null && Object.keys(_data).length>0){
        this.model.firstName = _data.Vname;
        this.model.lastName = _data.Nname;
        this.model.mrn = _data.Patnr;
        this.model.age = _data.Age;
        this.model.sex = _data.Sex;
        this.model.birthDate = moment(_data.Gbdat.toString().replace(/\//g, "")).format("DD.MM.YYYY");
        this.model.contact = '';
        this.model.email = _data.Emailid;
      }
      
    });
  }
  /**Screen Interaction */
  logOut(){
    this.storage.clear();
    this._api.remLocal('isLoggedIn');
    this._api.remLocal('token');
    this._api.remLocal('username');
    window.location.reload();
  }
  

}
