import { Component, OnInit } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { FilterPopoverComponent } from '../filter-popover/filter-popover.component';
import * as _ from "lodash";
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { PdfViewComponent } from '../pdf-view/pdf-view.component';
import { AlertController, ModalController } from '@ionic/angular';
import { KeyValue } from '@angular/common';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataService } from './../services/data.service';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-medical-reports',
  templateUrl: './medical-reports.page.html',
  styleUrls: ['./medical-reports.page.scss'],
})
export class MedicalReportsPage implements OnInit {
  model: any = {};
  documents: any;
  documentsMobile: any;
  documentsOld: any;
  emergencyDocuments: any;
  physicanDocuments: any;
  medicalDocuments: any;
  statusFilter: any = [];
  documentTypesFilter: any = [];
  physicianFilter: any = [];
  previousSortKeyDesc: any = '';
  previousSortKeyAsc: any = '';

  constructor(
    public popoverController: PopoverController,
    private documentViewer: DocumentViewer,
    private modalController: ModalController,
    public platform: Platform,
    private translate: TranslateService,
    private _dataServices: DataService,
    private _loader: LoaderService,
    private _api: ApiService,
    private storage: Storage,
    public alertController: AlertController,
    private router: Router,
  ) { }

  /**Dialog and Loaders*/
  async openModal(_base64, documentNo) {
    const modal = await this.modalController.create({
      component: PdfViewComponent,
      backdropDismiss: false,
      componentProps: { data: _base64, documentNo: documentNo },
      cssClass: 'pdfViewer',

    });
    return await modal.present();
  }
  async openModalMobile(_base64, documentNo) {
    const modal = await this.modalController.create({
      component: PdfViewComponent,
      backdropDismiss: false,
      componentProps: { data: _base64, documentNo: documentNo },
    });
    return await modal.present();
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: UserPopoverComponent,
      event: ev,
      translucent: true,
      animated: true,
    });
    return await popover.present();
  }
  async filterPopover(ev: any) {
    let that = this;
    const popover = await this.popoverController.create({
      component: FilterPopoverComponent,
      componentProps: {
        id: 'MED',
        status: that.statusFilter,
        physicians: that.physicianFilter,
        type: that.documentTypesFilter,
        statusFilterValue: that.model.statusFilterVal,
        physicianFilterValue: that.model.physicianFilterVal,
        typeFilterValue: that.model.typeFilterVal,
        dateFromValue: that.model.dateFrom,
        dateToValue: that.model.dateTo,
        timeFromValue: that.model.timeFrom,
        timeToValue: that.model.timeTo
      },
      event: ev,
      translucent: true,
      animated: true,
    });

    popover.onDidDismiss().then((data) => {
      let _filterCount = 0;
      that.model.statusFilterVal = data.data.status;
      if (that.model.statusFilterVal) {
        _filterCount++;
      }
      that.model.physicianFilterVal = data.data.physician;
      if (that.model.physicianFilterVal) {
        _filterCount++;
      }
      that.model.typeFilterVal = data.data.type;
      if (that.model.typeFilterVal) {
        _filterCount++;
      }

      that.model.dateFrom = data.data.dateFrom;
      if (that.model.dateFrom){
        _filterCount++;
      }
      that.model.dateTo = data.data.dateTo;
      if (that.model.dateTo){
        _filterCount++;
      }
      that.model.timeFrom = data.data.timeFrom;
      if (that.model.timeFrom){
        _filterCount++;
      }
      that.model.timeTo = data.data.timeTo;
      if (that.model.timeTo){
        _filterCount++;
      }

      that.model.filterCount = _filterCount;
      that.filterUserList(that.model.statusFilterVal, that.model.physicianFilterVal, that.model.typeFilterVal
                         ,that.model.dateFrom,that.model.dateTo,that.model.timeFrom,that.model.timeTo);
    })
    return await popover.present();
  }
  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [{
        text: 'Ok',
        handler: (val) => {
          // if (title == "SessionExpired") {
          //   this.router.navigateByUrl('login');
          // }
        }
      }]
    });
    await alert.present();
  }
  showAlertMessage(title, message) {
    this.presentAlert(title, message);
  }
  /**Helper Methods */
  getFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Futura-Medium' : 'Helvetica-Arabic-Medium';
  }
  getFontFamilyAlert(){
    return this.translate.getDefaultLang() == 'en' ? 'font-english' : 'font-arabic';
  }
  resetSortKeys() {
    this.model.documentNumberAsc = 'iconNotSort';
    this.model.documentNumberDesc = 'iconNotSort';
    this.model.dateAsc = 'iconNotSort';
    this.model.dateDesc = 'iconNotSort';
    this.model.timeAsc = 'iconNotSort';
    this.model.timeDesc = 'iconNotSort';
    this.model.typeAsc = 'iconNotSort';
    this.model.typeDesc = 'iconNotSort';
    this.model.physicianAsc = 'iconNotSort';
    this.model.physicianDesc = 'iconNotSort';
    this.model.statusAsc = 'iconNotSort';
    this.model.statusDesc = 'iconNotSort';
  }
  customSort(a: KeyValue<number, string>, b: KeyValue<number, string>) {
    //Do not do anything since originalOrder is not working;
    return 0;
  }
  getReportCode(code) {
    switch (code) {
      case 'ZMED_PHDIS':
        return 'PHY';
      case 'ZMED_ERDIS':
        return 'EME';
      case 'ZMED_MEDRP':
        return 'MED';
      default:
        return 'ALL';
    }
  }
  getDateDisplay(item) {
    //console.log(item);
    return item[0].date;
  }
  getAlignmentClassRight() {
    return this.translate.getDefaultLang() == 'en' ? 'pull-right' : 'pull-left';
  }
  getAlignmentClassLeft() {
    return this.translate.getDefaultLang() == 'en' ? 'pull-left' : 'pull-right';
  }
  getAlignmentClass() {
    return this.translate.getDefaultLang() == 'en' ? 'float-right' : 'float-left';
  }
  getIconAttr(lt){
    return lt.DocCat == 'Image' ? '3.85em' : '5em';
  }
  padZeros(string, length) {
    var my_string = '' + string;
    while (my_string.length < length) {
      my_string = '0' + my_string;
    }
    return my_string;
  }
  formatTime(time) {
    let that = this;
    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var hours = 0, minutes = 0, seconds = 0, totalseconds;

    if (reptms.test(time)) {
      var matches = reptms.exec(time);
      if (matches[1]) hours = Number(matches[1]);
      if (matches[2]) minutes = Number(matches[2]);
      if (matches[3]) seconds = Number(matches[3]);
      totalseconds = hours * 3600 + minutes * 60 + seconds;
    }
    return that.padZeros(hours, 2) + ":" + that.padZeros(minutes, 2) + ":" + that.padZeros(seconds, 2);
  }
  renderStatus(status, isAccessible) {
    //console.log(status);
    if (isAccessible) {
      return '#1caf9a';
    }
    else {
      return '#FFF2C5';
    }
    // if (status == 'RE') {
    //   return '#FFF2C5';
    // }
    // else {
    //   return '#1caf9a';
    // }
  }
  
  /* renderStatus(status) {
    //console.log(status);
    if (status == 'RE') {
      return '#FFF2C5';
    }
    else {
      return '#1caf9a';
    }
  } */
  getButtonFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Helvetica-Arabic-Medium': 'Futura-Medium';
  }
  /**Default Methods*/
  ngOnInit() {
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    this.model.filterCount = 0;
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
    this.loadData();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.model.language = event.lang == 'en' ? true : false;
    });
    this.resetSortKeys();
  }
  ionViewDidEnter() {
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    this.model.filterCount = 0;
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
    this.loadData();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.model.language = event.lang == 'en' ? true : false;
    });
    this.resetSortKeys();
  }
  /**Screen Interaction */
  openProfile(event) {
    this.presentPopover(event);
  }
  toggleGroup(group) {
    //console.log(group);
    group.value[0].show = !group.value[0].show;
  }
  isGroupShown(group) {
    return group.value[0].show;
  }
  sortData() {

  }
  showFilters() {
    this.filterPopover(event);
  }
  showPDF(_object) {
    let that = this;
    if (_object.isAccessible) {
      let msg = this.translate.instant('dialog_title_loading');
      this._loader.showLoader(msg);

      this.loadDetails(_object.documentKey, _object.documentNo);
    }
    else {
      Swal.fire({
        title: this.translate.instant('alert_title_warning'),
        text: this.translate.instant('alert_message_report'),
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

  }
  openPDF(_object) {
    let that = this;
    if (_object.isAccessible) {
      let msg = this.translate.instant('dialog_title_loading');
      this._loader.showLoader(msg);

      this.loadDetails(_object.documentKey, _object.documentNo);
    }
    else {
      Swal.fire({
        title: this.translate.instant('alert_title_warning'),
        text: this.translate.instant('alert_message_report'),
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
  }
  filterDocuments(type) {
    //console.log(type);
    let that = this;
    switch (type) {
      case 'ALL':
        this.model.selectedAll = 'tab-selected';
        this.model.selectedEmergency = '';
        this.model.selectedPhysician = '';
        this.model.selectedMedical = '';

        let formattedDocuments = _.groupBy(that.documentsOld, 'date');
        that.documents = that.documentsOld;

        _.forEach(formattedDocuments, function (_document) {
          _document['lineItems'] = _document;
        });
        that.documentsMobile = formattedDocuments


        break;
      case 'EME':
        this.model.selectedAll = '';
        this.model.selectedEmergency = 'tab-selected';
        this.model.selectedPhysician = '';
        this.model.selectedMedical = '';

        let _emergencyDocuments = _.groupBy(that.emergencyDocuments, 'date');
        _.forEach(_emergencyDocuments, function (_document) {
          _document['lineItems'] = _document;
        });
        that.documents = that.emergencyDocuments;
        that.documentsMobile = _emergencyDocuments;

        break;
      case 'PHY':
        this.model.selectedAll = '';
        this.model.selectedEmergency = '';
        this.model.selectedPhysician = 'tab-selected';
        this.model.selectedMedical = '';

        let _physicianDocuments = _.groupBy(that.physicanDocuments, 'date');
        _.forEach(_physicianDocuments, function (_document) {
          _document['lineItems'] = _document;
        });
        that.documents = that.physicanDocuments;
        that.documentsMobile = _physicianDocuments;

        break;
      case 'MED':
        this.model.selectedAll = '';
        this.model.selectedEmergency = '';
        this.model.selectedPhysician = '';
        this.model.selectedMedical = 'tab-selected';

        let _medicalDocuments = _.groupBy(that.medicalDocuments, 'date');
        _.forEach(_medicalDocuments, function (_document) {
          _document['lineItems'] = _document;
        });
        that.documents = that.medicalDocuments;
        that.documentsMobile = _medicalDocuments;
        break;
    }
  }
  filterList(evt) {

    this.documents = this.documentsOld;
    this.documentsMobile = this.documentsOld;
    const searchTerm = evt.srcElement.value;
    //console.log(searchTerm);
    if (!searchTerm) {
      this.documents = this.documentsOld;
      let formattedDocuments = _.groupBy(this.documents, 'date');
      _.forEach(formattedDocuments, function (_document) {
        _document['lineItems'] = _document;
      });
      this.documentsMobile = formattedDocuments;
      return;
    }
    if (searchTerm == "") {
      this.documents = this.documentsOld;
    }
    this.documents = this.documents.filter(document => {
      if (document.documentNo && searchTerm) {
        if (document.documentNo.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || document.physician.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || document.status.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    let formattedDocuments = _.groupBy(this.documents, 'date');
    _.forEach(formattedDocuments, function (_document) {
      _document['lineItems'] = _document;
    });
    this.documentsMobile = formattedDocuments;

  }
  filterListClear(evt) {
    this.documents = this.documentsOld;
    let formattedDocuments = _.groupBy(this.documents, 'date');
    _.forEach(formattedDocuments, function (_document) {
      _document['lineItems'] = _document;
    });
    this.documentsMobile = formattedDocuments;
  }
  filterUserList(status, physician, type,dateFrom, dateTo, timeFrom, timeTo) {
    this.documents = this.documentsOld;
    let dateTimeFilter = false;
    if(timeFrom){
      timeFrom = timeFrom + ":00";
    }
    if(timeTo){
      timeTo = timeTo + ":00";
    }
    if(dateFrom){
      let d1 = new Date(dateFrom);
      let d2 = dateTo? new Date(dateTo): new Date();
      if(timeFrom && timeTo){
        this.documents = _.filter(this.documents,function(doc){ 
          return new Date(doc.dateFormattedStr) >= d1 && new Date(doc.dateFormattedStr) <= d2 && doc.time >= timeFrom && doc.time <= timeTo;
        });
      }
      else if(timeFrom){
        this.documents = _.filter(this.documents,function(doc){ 
          return new Date(doc.dateFormattedStr) >= d1 && new Date(doc.dateFormattedStr) <= d2 && doc.time >= timeFrom;
        });
      }
      else if(timeTo){
        this.documents = _.filter(this.documents,function(doc){ 
          return new Date(doc.dateFormattedStr) >= d1 && new Date(doc.dateFormattedStr) <= d2 && doc.time <= timeTo;
        });
      }
      else {
        this.documents = _.filter(this.documents,function(doc){ 
          return new Date(doc.dateFormattedStr) >= d1 && new Date(doc.dateFormattedStr) <= d2;
        });
      }
      dateTimeFilter = true;
    }
    if (status && physician && type) {//111
      // this.documents = this.documents.filter(document => {
      //   if (document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1 &&
      //     document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1 &&
      //     document.type.toLowerCase().indexOf(type.toLowerCase()) > -1) {
      //     return true;
      //   }
      //   return false;
      // });
      this.documents = _.filter(this.documents,function(doc){ 
        return status == doc.status && physician.indexOf(doc.physician)!=-1 && type.indexOf(doc.type)!=-1;
      });
    }
    else if (status && physician && !type) {//110
      // this.documents = this.documents.filter(document => {
      //   if (document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1 &&
      //     document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1) {
      //     return true;
      //   }
      //   return false;
      // });
      this.documents = _.filter(this.documents,function(doc){ 
        return status == doc.status && physician.indexOf(doc.physician)!=-1;// && type.indexOf(doc.type)!=-1;
      });
    }
    //101
    else if (status && !physician && type) {
      // this.documents = this.documents.filter(document => {
      //   if (document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1
      //     && document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1
      //     && document.type.toLowerCase().indexOf(type.toLowerCase()) > -1) {
      //     return true;
      //   }
      //   return false;
      // });
      this.documents = _.filter(this.documents,function(doc){ 
        return status == doc.status && type.indexOf(doc.type)!=-1;
      });
    }//100
    else if (status && !physician && !type) {
      // this.documents = this.documents.filter(document => {
      //   if (document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1
      //     // && document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1
      //     // && document.type.toLowerCase().indexOf(type.toLowerCase()) > -1
      //   ) {
      //     return true;
      //   }
      //   return false;
      // });
      this.documents = _.filter(this.documents,function(doc){ 
        return status == doc.status;
      });
    }//011
    else if (!status && physician && type) {
      // this.documents = this.documents.filter(document => {
      //   if (
      //     //document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1
      //     document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1
      //     && document.type.toLowerCase().indexOf(type.toLowerCase()) > -1) {
      //     return true;
      //   }
      //   return false;
      // });
      this.documents = _.filter(this.documents,function(doc){ 
        return physician.indexOf(doc.physician)!=-1 && type.indexOf(doc.type)!=-1;
      });
    }//010
    else if (!status && physician && !type) {
      // this.documents = this.documents.filter(document => {
      //   if (
      //     //document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1
      //     document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1
      //     //&& document.type.toLowerCase().indexOf(type.toLowerCase()) > -1
      //   ) {
      //     return true;
      //   }
      //   return false;
      // });
      this.documents = _.filter(this.documents,function(doc){ 
        return physician.indexOf(doc.physician)!=-1;
      });
    }//001
    else if (!status && !physician && type) {
      // this.documents = this.documents.filter(document => {
      //   if (document.type.toLowerCase().indexOf(type.toLowerCase()) > -1) {
      //     return true;
      //   }
      //   return false;
      // });
      this.documents = _.filter(this.documents,function(doc){ 
        return type.indexOf(doc.type)!=-1;
      });
    }
    else {
      if(!dateTimeFilter)
      this.documents = this.documentsOld;
    }
    let formattedDocuments = _.groupBy(this.documents, 'date');
    _.forEach(formattedDocuments, function (_document) {
      _document['lineItems'] = _document;
    });
    this.documentsMobile = formattedDocuments;
  }
  sortDescending(key) {
    this.previousSortKeyAsc = '';
    if (this.previousSortKeyDesc == key) {

    }
    else {
      this.previousSortKeyDesc = key;
      if (key == "date") {
        key = "dateFormatted";
      }
      let className = 'iconSort';
      this.resetSortKeys();
      switch (key) {
        case 'documentNo':
          this.model.documentNumberDesc = className;
          break;
        case 'type':
          this.model.typeDesc = className;
          break;
        case 'dateFormatted':
          this.model.dateDesc = className;
          break;
        case 'time':
          this.model.timeDesc = className;
          break;
        case 'physician':
          this.model.physicianDesc = className;
          break;
        case 'status':
          this.model.statusDesc = className;
          break;
        default:
          this.resetSortKeys();
          break;
      }
      this.documents = _.sortBy(this.documents, [key, 'documentNo']).reverse();
    }
  }
  sortAscending(key) {
    this.previousSortKeyDesc = '';
    if (this.previousSortKeyAsc == key) {

    }
    else {
      this.previousSortKeyAsc = key;
      if (key == "date") {
        key = "dateFormatted";
      }
      let className = 'iconSort';
      this.resetSortKeys();
      switch (key) {
        case 'documentNo':
          this.model.documentNumberAsc = className;
          break;
        case 'type':
          this.model.typeAsc = className;
          break;
        case 'dateFormatted':
          this.model.dateAsc = className;
          break;
        case 'time':
          this.model.timeAsc = className;
          break;
        case 'physician':
          this.model.physicianAsc = className;
          break;
        case 'status':
          this.model.statusAsc = className;
          break;
        default:
          this.resetSortKeys();
          break;
      }
      this.documents = _.sortBy(this.documents, [key, 'documentNo'], 'asc')
    }
  }
  openDocument(_base64, _documentNo) {
    //this.documentViewer.viewDocument('../../assets/files/Sample.pdf','application/pdf',{});
    this.openModal(_base64, _documentNo);
  }
  switchLanguage() {
    this.model.language ? this.translate.use('en') : this.translate.use('ar');
    this.model.language ? this.translate.setDefaultLang('en') : this.translate.setDefaultLang('ar');
  }
  changeLanguage(){
    if(this.translate.getDefaultLang()=='en'){
      this.translate.use('ar');
      this.translate.setDefaultLang('ar');
    }
    else{
      this.translate.use('en');
      this.translate.setDefaultLang('en');
    }
  }
  /**Data API */
  loadData() {
    let that = this;
    that.storage.get(that._api.getLocal('token')).then((val) => {
      let _data = val.SESSIONTOMEDREP.results;
      console.log(_data);
      if (_data.length > 0) {
        _.forEach(_data, function (data) {
          data.documentNo = data.Doknr;
          data.date = moment(data.Ddate.toString().replace(/\//g, "")).format("DD.MM.YYYY");
          data.time = that.formatTime(data.Dtime);
          data.type = data.DocCat;
          data.typeCode = that.getReportCode(data.DtID);//data.DocCat;
          data.physician = data.Physician;
          data.statusCode = data.Status;
          data.status = data.StatusTxt;
          // data.class = data.statusCode == 'RE' ? 'task-review' : 'task-warning';
          data.class = data.Accessible != 'X' ? 'task-review' : 'task-warning';
          data.isAccessible = data.Accessible == 'X' ? true : false;
          data.documentKey = data.DocKey;
        });

        that.statusFilter = _.uniqBy(_data, 'statusCode');
        that.documentTypesFilter = _.uniqBy(_data, 'type');
        that.physicianFilter = _.uniqBy(_data, 'physician');

        //console.log(this.documents);
        let _emergencyDocuments = _.map(_data, function (o) {
          if (o.typeCode == 'EME') return o;
        });
        _emergencyDocuments = _.without(_emergencyDocuments, undefined);
        this.emergencyDocuments = _emergencyDocuments;

        let _physicianDocuments = _.map(_data, function (o) {
          if (o.typeCode == 'PHY') return o;
        });
        _physicianDocuments = _.without(_physicianDocuments, undefined);
        this.physicanDocuments = _physicianDocuments;

        let _medicalDocuments = _.map(_data, function (o) {
          if (o.typeCode == 'MED') return o;
        });
        _medicalDocuments = _.without(_medicalDocuments, undefined);
        this.medicalDocuments = _medicalDocuments;

        this.model.allDocuments = _data.length;
        this.model.emergencyDocuments = _emergencyDocuments.length;
        this.model.physicianDocuments = _physicianDocuments.length;
        this.model.medicalDocuments = _medicalDocuments.length;

        this.documentsOld = _data;
        let formattedDocuments = _.groupBy(_data, 'date');
        _.forEach(formattedDocuments, function (_document) {
          _document['lineItems'] = _document;
        });
        this.documentsMobile = formattedDocuments;
        this.documents = _data;
        this.filterDocuments('ALL');

      }
      else {
        Swal.fire({
          title: this.translate.instant('lbl_no_data'),
          text: this.translate.instant('lbl_no_data_msg'),
          backdrop: false,
          customClass:{
            title:that.getFontFamilyAlert(),
            header:that.getFontFamilyAlert(),
            content: that.getFontFamilyAlert(),
            container: that.getFontFamilyAlert(),
            confirmButton: that.getFontFamilyAlert(),
          },
          icon: 'info',
          confirmButtonColor: 'rgb(87,143,182)',
          confirmButtonText: this.translate.instant('lbl_filter_ok')
        }).then((result) => {
          this.router.navigateByUrl('home');
        });
      }
    });

  }

  loadDetails(_documentKey, _documentNo) {
    let that = this;

    let _param = {
      DocKey: _documentKey,
      Patnr: that._api.getLocal('username'),
      Token: that._api.getLocal('token'),
    }
    that._dataServices.loadData('DOCPDFSET', _param, null, false, null, false).subscribe(
      _success => {
        that._loader.hideLoader();
        let _obj = _success.d;
        //console.log(_obj);
        if (that.model.isVisible) {
          this.openModalMobile(_obj.PDFData, _documentNo);
        }
        else {
          that.openDocument(_obj.PDFData, _documentNo);
        }


      }, _error => {
        that._loader.hideLoader();
        let _errorResponse = JSON.parse(_error._body);
        Swal.fire({
          title: this.translate.instant('lbl_error'),//_errorResponse.error.code,
          text: _errorResponse.error.message.value,
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
        //this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )
  }

}
