import { Component } from '@angular/core';
import { PopoverController,Platform } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../services/data.service';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import * as _ from "lodash";
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tiles: any = [];
  model: any = {};

  constructor(
    public popoverController: PopoverController,
    public platform:Platform,
    private translate: TranslateService,
    private _dataServices: DataService,
    private _loader: LoaderService,
    private _api: ApiService,
  ) {}

  /*Dialogs and Loaders*/
  async presentPopover(ev:any){
    const popover = await this.popoverController.create({
      component: UserPopoverComponent,
      event: ev,
      translucent: true,
      animated:true,
    });
    return await popover.present();
  }
  /**Helper Functions */
  getAlignRight(){
    return this.translate.getDefaultLang()=='en'?'20px':'unset';
  }
  getAlignLeft(){
    return this.translate.getDefaultLang()=='en'?'unset':'20px';
  }
  setLocalModel(_data){
    let _laboratory = _data.SESSIONTOLABDATA.results;
    _.forEach(_laboratory,function(data){
      data.dateFormatted = data.Sdate.toString().replace(/\//g, "")
    });
    
    let _radiology = _data.SESSIONTORADDATA.results;
    _.forEach(_radiology,function(data){
      data.dateFormatted = data.Edate.toString().replace(/\//g, "")
    });
    //debugger;

    
    this.model.laboratoryCount = _laboratory.length;
    this.model.laboratoryLastDate = '';
    this.model.radiologyCount = _radiology.length;
    this.model.radiologyLastDate = '';

  }
  /*Default Methods*/
  ngOnInit(){
    this._loadData();
    // this.model.laboratoryCount = 23;
    this.model.nutritionCount = 5;
    this.model.radiologyCount = 13;
    this.model.medicalCount = 45;
    this.platform.is('android')||this.platform.is('ios')||this.platform.is('iphone')?this.model.isVisible = true
                                                                                    :this.model.isVisible = false;
  }
  ionViewDidEnter(){
    this.tiles.push(
      {id:1,title:'Laboratory',subtitle:'Access to the laboratory reports',icon:'icon-flask.svg',class:'',pendingDocuments:'',lastDate:''},
      {id:2,title:'Nutrition',subtitle:'Access to the nutrition care reports',icon:'icon-nutrition.svg',class:'',pendingDocuments:'',lastDate:''},
      {id:3,title:'Radiology',subtitle:'Access to the radiology reports and images',icon:'icon-radiology.svg',class:'',pendingDocuments:'',lastDate:''},
      {id:4,title:'Medical Reports',subtitle:'Access General Medical Reports, ER and Hospital Discharge reports',icon:'icon-report.svg',class:'',pendingDocuments:'',lastDate:''},
    );
  }
  /**Data API */
  _loadData(){
    let that = this;
    let msg = this.translate.instant('dialog_title_authentication');
   //this._loader.showLoader(msg);

    let _param = {
      Patnr:that._api.getLocal('username'),
      Token:that._api.getLocal('token')
    }

    that._dataServices.loadData('SESSIONSET',_param,null,false,['SESSIONTOLABDATA','SESSIONTORADDATA'],true).subscribe(
      _success=>{
        //that._loader.hideLoader();
        let _obj = _success.d;
        that._dataServices.setData(_obj.Token,_obj);
        console.log(that._dataServices.getData(_obj.Token));
        that.setLocalModel(that._dataServices.getData(_obj.Token));
      },_error=>{
        //that._loader.hideLoader();
      }
    )

    

  }
  /**Screen Interaction*/
  openProfile(event){
    this.presentPopover(event);
  }
}
