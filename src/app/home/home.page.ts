import { Component } from '@angular/core';
import { PopoverController,Platform } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../services/data.service';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import Swal from 'sweetalert2';

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
    private storage: Storage,
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
      data.dateFormattedStr = moment(data.Sdate.toString().replace(/\//g, "")).format("YYYY-MM-DD");
      data.dateFormatted = new Date(data.dateFormattedStr);
      data.lastDate =  moment(data.Sdate.toString().replace(/\//g, "")).format("Do MMM YYYY");
    });

    _laboratory = _.sortBy(_laboratory,'dateFormatted').reverse();
    
    let _radiology = _data.SESSIONTORADDATA.results;
    _.forEach(_radiology,function(data){
      data.dateFormattedStr = moment(data.Edate.toString().replace(/\//g, "")).format("YYYY-MM-DD");
      data.dateFormatted = new Date(data.dateFormattedStr);
      data.lastDate =  moment(data.Edate.toString().replace(/\//g, "")).format("Do MMM YYYY");
    });
    //debugger;
    _radiology = _.sortBy(_radiology,'dateFormatted').reverse();

    let _nutrition = _data.SESSIONTONUTCARE.results;
    _.forEach(_nutrition,function(data){
      data.dateFormattedStr = moment(data.Ddate.toString().replace(/\//g, "")).format("YYYY-MM-DD");
      data.dateFormatted = new Date(data.dateFormattedStr);
      data.lastDate =  moment(data.Ddate.toString().replace(/\//g, "")).format("Do MMM YYYY");
    });
    //debugger;
    _nutrition = _.sortBy(_nutrition,'dateFormatted').reverse();

    let _medReports = _data.SESSIONTOMEDREP.results;
    _.forEach(_medReports,function(data){
      data.dateFormattedStr = moment(data.Ddate.toString().replace(/\//g, "")).format("YYYY-MM-DD");
      data.dateFormatted = new Date(data.dateFormattedStr);
      data.lastDate =  moment(data.Ddate.toString().replace(/\//g, "")).format("Do MMM YYYY");
    });
    //debugger;
    _medReports = _.sortBy(_medReports,'dateFormatted').reverse();
    
    this.model.laboratoryCount = _laboratory.length;
    this.model.laboratoryLastDate = _laboratory.length>0?_laboratory[0].lastDate:'-';
    this.model.radiologyCount = _radiology.length;
    this.model.radiologyLastDate = _radiology.length>0?_radiology[0].lastDate:'-';
    this.model.nutritionCount = _nutrition.length;
    this.model.nutritionLastDate = _nutrition.length>0?_nutrition[0].lastDate:'-';
    this.model.medicalCount = _medReports.length;
    this.model.medicalLastDate = _medReports.length>0?_medReports[0].lastDate:'-';

  }
  deleteSession(){
    let that = this;
    let msg = this.translate.instant('dialog_title_logout');
    this._loader.showLoader(msg);

    let _param = {
      Patnr: that._api.getLocal('username'),
      Token: that._api.getLocal('token')
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
  /*Default Methods*/
  ngOnInit(){
    let msg = this.translate.instant('dialog_title_loading');
    this._loader.showLoader(msg);

    this._loadData();
    
    this.model.laboratoryCount = 0;
    this.model.nutritionCount = 0;
    this.model.radiologyCount = 0;
    this.model.medicalCount = 0;
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
    let _param = {
      Patnr:that._api.getLocal('username'),
      Token:that._api.getLocal('token')
    }

    that._dataServices.loadData('SESSIONSET',_param,null,false,['SESSIONTOLABDATA','SESSIONTORADDATA','SESSIONTONUTCARE','SESSIONTOMEDREP'],true).subscribe(
      _success=>{
        that._loader.hideLoader();
        let _obj = _success.d;
        that._dataServices.setData(_obj.Token,_obj);
        console.log(that._dataServices.getData(_obj.Token));
        that.setLocalModel(that._dataServices.getData(_obj.Token));
      },_error=>{
        that._loader.hideLoader();
        let errorObj = JSON.parse(_error._body);
        Swal.fire(errorObj.error.code, errorObj.error.message.value, 'error').then((result)=>{
          that.deleteSession();
        });
      }
    )

    

  }
  /**Screen Interaction*/
  openProfile(event){
    this.presentPopover(event);
  }
}
