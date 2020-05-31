import { Component, OnInit } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { FilterPopoverComponent } from '../filter-popover/filter-popover.component';
import * as _ from "lodash";
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { PdfViewComponent } from '../pdf-view/pdf-view.component';
import { AlertController, ModalController } from '@ionic/angular';
import { KeyValue } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../services/data.service';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.page.html',
  styleUrls: ['./laboratory.page.scss'],
})
export class LaboratoryPage implements OnInit {

  model: any = {};
  documents: any;
  statusFilter: any = [];
  documentTypesFilter: any = [];
  physicianFilter: any = [];
  documentsMobile: any;
  documentsOld: any;



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
    // private moment:moment.Moment,
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
        id: 'LAB',
        status: that.statusFilter,
        physicians: that.physicianFilter,
        type: that.documentTypesFilter,
        statusFilterValue: that.model.statusFilterVal,
        physicianFilterValue: that.model.physicianFilterVal,
        typeFilterValue: that.model.typeFilterVal
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
      that.model.filterCount = _filterCount;
      that.filterUserList(that.model.statusFilterVal, that.model.physicianFilterVal, that.model.typeFilterVal);
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
  customSort(a: KeyValue<number, string>, b: KeyValue<number, string>) {
    //Do not do anything since originalOrder is not working;
    return 0;
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
  renderStatus(status) {
    //console.log(status);
    if (status == 'RE') {
      return '#FFF2C5';
    }
    else {
      return '#1caf9a';
    }
  }
  /**Default Methods*/
  ngOnInit() {
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    this.model.filterCount = 0;
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
    this.loadData();
  }
  ionViewDidEnter() {
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    this.model.filterCount = 0;
    this.model.language = this.translate.getDefaultLang() == 'en' ? true : false;
    this.loadData();
  }
  /**Screen Interaction */
  openProfile(event) {
    this.presentPopover(event);
  }
  toggleGroup(group) {
    // console.log(group);
    group.value[0].show = !group.value[0].show;
  }
  isGroupShown(group) {
    return group.value[0].show;
  }
  sortData() {

  }
  showFilters(event) {
    this.filterPopover(event);
  }
  showPDF(_object) {
    if (_object.statusCode == 'RE') {
      Swal.fire({
        title: this.translate.instant('alert_title_warning'),
        text: this.translate.instant('alert_message_report'),
        backdrop: false,
        icon: 'warning',
        confirmButtonColor: 'rgb(87,143,182)'
      });
    }
    else {
      let msg = this.translate.instant('dialog_title_loading');
      this._loader.showLoader(msg);
      this.loadDetails(_object.documentKey, _object.documentNo);
    }
  }
  openPDF(_object) {
    if (_object.statusCode == 'RE') {
      Swal.fire({
        title: this.translate.instant('alert_title_warning'),
        text: this.translate.instant('alert_message_report'),
        backdrop: false,
        icon: 'warning',
        confirmButtonColor: 'rgb(87,143,182)'
      });
    }
    else {
      let msg = this.translate.instant('dialog_title_loading');
      this._loader.showLoader(msg);
      this.loadDetails(_object.documentKey, _object.documentNo);
    }
  }
  filterList(evt) {

    this.documents = this.documentsOld;
    const searchTerm = evt.srcElement.value;
    console.log(searchTerm);
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
  filterUserList(status, physician, type) {
    this.documents = this.documentsOld;
    if (status && physician && type) {//111
      this.documents = this.documents.filter(document => {
        if (document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1 &&
          document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1 &&
          document.type.toLowerCase().indexOf(type.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }
    else if (status && physician && !type) {//110
      this.documents = this.documents.filter(document => {
        if (document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1 &&
          document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }
    //101
    else if (status && !physician && type) {
      this.documents = this.documents.filter(document => {
        if (document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1
          && document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1
          && document.type.toLowerCase().indexOf(type.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }//100
    else if (status && !physician && !type) {
      this.documents = this.documents.filter(document => {
        if (document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1
          // && document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1
          // && document.type.toLowerCase().indexOf(type.toLowerCase()) > -1
        ) {
          return true;
        }
        return false;
      });
    }//011
    else if (!status && physician && type) {
      this.documents = this.documents.filter(document => {
        if (
          //document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1
          document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1
          && document.type.toLowerCase().indexOf(type.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }//010
    else if (!status && physician && !type) {
      this.documents = this.documents.filter(document => {
        if (
          //document.statusCode.toString().toLowerCase().indexOf(status.toLowerCase()) > -1
          document.physician.toLowerCase().indexOf(physician.toLowerCase()) > -1
          //&& document.type.toLowerCase().indexOf(type.toLowerCase()) > -1
        ) {
          return true;
        }
        return false;
      });
    }//001
    else if (!status && !physician && type) {
      this.documents = this.documents.filter(document => {
        if (document.type.toLowerCase().indexOf(type.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }
    else {
      this.documents = this.documentsOld;
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
  /**Data API */
  loadData() {
    let that = this;
    that.storage.get(that._api.getLocal('token')).then((val) => {
      let _data = val.SESSIONTOLABDATA.results;
      console.log(_data);
      if (_data.length > 0) {
        _.forEach(_data, function (data) {
          data.documentNo = data.Doknr;
          data.date = moment(data.Sdate.toString().replace(/\//g, "")).format("DD.MM.YYYY");
          data.time = that.formatTime(data.Stime);
          data.type = data.Orgna;
          data.physician = data.Physician;
          data.statusCode = data.Status;
          data.status = data.StatusTxt;
          data.class = data.statusCode == 'RE' ? 'task-review' : 'task-warning';
          data.documentKey = data.DocKey;
        });

        that.statusFilter = _.uniqBy(_data, 'statusCode');
        that.documentTypesFilter = _.uniqBy(_data, 'type');
        that.physicianFilter = _.uniqBy(_data, 'physician');

        this.documentsOld = _data;
        let formattedDocuments = _.groupBy(_data, 'date');
        _.forEach(formattedDocuments, function (_document) {
          _document['lineItems'] = _document;
        });
        this.documentsMobile = formattedDocuments;
        this.documents = _data;
        //console.log(this.documents);
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
        console.log(_obj);
        //that.openDocument(_obj.PDFData,_documentNo);
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
          title: _errorResponse.error.code,
          text: _errorResponse.error.message.value,
          backdrop: false,
          icon: 'error',
          confirmButtonColor: 'rgb(87,143,182)'
        });
        //this.showAlertMessage(_errorResponse.error.code, _errorResponse.error.message.value);
      }
    )
  }

}
