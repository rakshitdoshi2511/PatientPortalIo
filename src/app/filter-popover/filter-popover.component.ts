import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams, PopoverController, Platform } from '@ionic/angular';
import * as _ from "lodash";
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss'],
})
export class FilterPopoverComponent implements OnInit {

  id: any = '';
  statusFilter: any = [];
  documentTypesFilter:any = [];
  physicianFilter:any = [];
  model:any={};

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private popoverController: PopoverController,
    private translate: TranslateService,
    private platform: Platform,
  ) { }

  /**Helper Methods */
  getFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Futura-Medium' : 'Helvetica-Arabic-Medium';
  }
  getFontFamilyAlert(){
    return this.translate.getDefaultLang() == 'en' ? 'font-english' : 'font-arabic';
  }
  compareWithFunctionStatus = (o1,o2) => {
    //return  o1 && o2 ? o1.statusCode === o2.statusCode: o1 === o2;
    return  o1 && o2 ? o1=== o2 : o1 === o2;
  }
  compareWithFunctionPhysician = (o1,o2) => {
    if(this.model.physician){
      return o1 && o2 ? this.model.physician.indexOf(o1)!=-1 : o1 === o2;
    }
    else{
      return  o1 && o2 ? o1.physician === o2.physician: o1 === o2;
    }
    
  }
  compareWithFunctionType = (o1,o2) => {
    if(this.model.type){
      return o1 && o2 ? this.model.type.indexOf(o1)!=-1 : o1 === o2;
    }
    else{
      return  o1 && o2 ? o1.type === o2.type: o1 === o2;
    }
    
  }
  compareWithStatus = this.compareWithFunctionStatus;
  compareWithPhysician = this.compareWithFunctionPhysician;
  compareWithType = this.compareWithFunctionType;

  checkDate(){
    if(this.model.dateFrom && this.model.dateTo){
      return new Date(this.model.dateFrom) > new Date(this.model.dateTo);
    }
    else if(this.model.dateFrom){
      return new Date(this.model.dateFrom) > new Date();
    }
    else{
      return false;
    }
  }
  checkTime(){
    if(this.model.timeFrom && this.model.timeTo){
      this.model.timeFrom = this.model.timeFrom + ":00";
      this.model.timeTo = this.model.timeTo + ":00";
      return this.model.timeFrom > this.model.timeTo;
    }
    else{
      return false;
    }
  }

  /**Default Methods */
  ngOnInit() {
    let that = this;
    that.model.statusFilterHidden = false;
    that.model.physicianFilterHidden = false;
    that.model.documentTypeFilterHidden = false;
    that.id = this.navParams.data.id;
    that.statusFilter = this.navParams.data.status;
    that.statusFilter = _.uniqBy(that.statusFilter,'status');

    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;

    if(that.statusFilter.length==0){
      that.model.statusFilterHidden = true;
    }
    that.documentTypesFilter = this.navParams.data.type;
    if(that.documentTypesFilter.length==0){
      that.model.documentTypeFilterHidden = true;
    }
    that.physicianFilter = this.navParams.data.physicians;
    if(that.physicianFilter.length==0){
      that.model.physicianFilterHidden = true;
    }
    if(that.id == 'MED'){
      //console.log("I am here");
      that.model.documentTypeFilterHidden = true;
      //that.model.statusFilterHidden = true;
    }
    if (that.id == 'NUT'){
      //that.model.statusFilterHidden = true;
    }
    that.model.status = this.navParams.data.statusFilterValue;
    that.model.physician = this.navParams.data.physicianFilterValue;
    that.model.type = this.navParams.data.typeFilterValue;

    that.model.dateFrom = this.navParams.data.dateFromValue;
    that.model.dateTo = this.navParams.data.dateToValue;

    that.model.timeFrom = this.navParams.data.timeFromValue;
    that.model.timeTo = this.navParams.data.timeToValue;
  }
  ionViewDidEnter(){
    let that = this;
    that.model.statusFilterHidden = false;
    that.model.physicianFilterHidden = false;
    that.model.documentTypeFilterHidden = false;
    that.id = this.navParams.data.id;
    that.statusFilter = this.navParams.data.status;

    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;

    that.statusFilter = _.uniqBy(that.statusFilter,'status');
    console.log(that.statusFilter);
    if(that.statusFilter.length==0){
      that.model.statusFilterHidden = true;
    }
    that.documentTypesFilter = this.navParams.data.type;
    if(that.documentTypesFilter.length==0){
      that.model.documentTypeFilterHidden = true;
    }
    that.physicianFilter = this.navParams.data.physicians;
    if(that.physicianFilter.length==0){
      that.model.physicianFilterHidden = true;
    }
    if(that.id == 'MED'){
      //console.log("I am here");
      that.model.documentTypeFilterHidden = true;
      //that.model.statusFilterHidden = true;
    }
    if (that.id == 'NUT'){
      //that.model.statusFilterHidden = true;
    }
    that.model.status = this.navParams.data.statusFilterValue;
    that.model.physician = this.navParams.data.physicianFilterValue;
    that.model.type = this.navParams.data.typeFilterValue;

    that.model.dateFrom = this.navParams.data.dateFromValue;
    that.model.dateTo = this.navParams.data.dateToValue;

    that.model.timeFrom = this.navParams.data.timeFromValue;
    that.model.timeTo = this.navParams.data.timeToValue;
  }
  /**Screen Interaction */
  applyFilters(){
    debugger;
    let that = this;
    //console.log(this.model.status);
    if(this.model.isVisible){
      if(this.model.dateFrom){
        this.model.dateFrom = this.model.dateFrom.split("T")[0];
      }
      if(this.model.dateTo){
        this.model.dateTo = this.model.dateTo.split("T")[0];
      }
      if(this.model.timeFrom){
        this.model.timeFrom = this.model.timeFrom.split("T")[1].split(".")[0].substr(0,5);
      }
      if(this.model.timeTo){
        this.model.timeTo = this.model.timeTo.split("T")[1].split(".")[0].substr(0,5);
      }
    }
    let isCheckDate = this.checkDate();
    let isCheckTime = this.checkTime();
    if(isCheckDate || isCheckTime){
      Swal.fire({
        title: this.translate.instant('lbl_warning'),
        text: this.translate.instant('lbl_warning_validation'),
        backdrop: false,
        customClass:{
          title:that.getFontFamilyAlert(),
          header:that.getFontFamilyAlert(),
          content: that.getFontFamilyAlert(),
          container: that.getFontFamilyAlert(),
          confirmButton: that.getFontFamilyAlert(),
          
         },
        icon: 'warning',
        confirmButtonColor: 'rgb(87,143,182)',
        confirmButtonText: this.translate.instant('lbl_filter_ok')
      });
    }
    else{
      let setFilter = {
        status: that.model.status,
        physician: that.model.physician,
        type:that.model.type,
        dateFrom: that.model.dateFrom,
        dateTo: that.model.dateTo,
        timeFrom: that.model.timeFrom,
        timeTo: that.model.timeTo
      }
      this.popoverController.dismiss(setFilter);
    }
  }
  clearFilters(){
    let that = this;
    this.model = {};
    let setFilter = {
      status: null,
      physician: null,
      type:null
    }
    this.popoverController.dismiss(setFilter);
  }

}
