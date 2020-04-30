import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { FilterPopoverComponent } from '../filter-popover/filter-popover.component';
import * as _ from "lodash";
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { PdfViewComponent } from '../pdf-view/pdf-view.component';
import { AlertController, ModalController } from '@ionic/angular';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.page.html',
  styleUrls: ['./laboratory.page.scss'],
})
export class LaboratoryPage implements OnInit {

  model: any = {};
  documents: any;
  documentsOld: any;

  

  constructor(
    public popoverController: PopoverController,
    private documentViewer:DocumentViewer,
    private modalController: ModalController,
  ) { }

  /**Dialog and Loaders*/
  async openModal() {
    const modal = await this.modalController.create({
      component: PdfViewComponent,
      componentProps: { },
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
    const popover = await this.popoverController.create({
      component: FilterPopoverComponent,
      event: ev,
      translucent: true,
      animated: true,
    });
    return await popover.present();
  }
  /**Helper Methods */
  customSort(a:KeyValue<number,string>, b:KeyValue<number,string>) {
    //Do not do anything since originalOrder is not working;
    return 0;
  }
  getDateDisplay(item) {
    console.log(item);
    return item[0].date;
  }
  /**Default Methods*/
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.loadData();
  }
  /**Screen Interaction */
  openProfile(event) {
    this.presentPopover(event);
  }
  toggleGroup(group) {
    console.log(group);
    group.value[0].show = !group.value[0].show;
  }
  isGroupShown(group) {
    return group.value[0].show;
  }
  sortData(){
    
  }
  showFilters(event) {
    this.filterPopover(event);
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
      this.documents = formattedDocuments;
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
    this.documents = formattedDocuments;

  }
  filterListClear(evt) {
    this.documents = this.documentsOld;
    let formattedDocuments = _.groupBy(this.documents, 'date');
    _.forEach(formattedDocuments, function (_document) {
      _document['lineItems'] = _document;
    });
    this.documents = formattedDocuments;
  }
  openDocument(){
    //this.documentViewer.viewDocument('../../assets/files/Sample.pdf','application/pdf',{});
    this.openModal();
  }
  /**Data API */
  loadData() {
    let _data = [];
    _data.push({
      documentNo: 10000,
      date: '27.10.2019',
      time: '06:28:18 AM',
      type: 'Laboratory',
      physician: 'Dr. Suzanne Al Sayed',
      status: 'On Review',
      statusCode: 1,
      class: 'task-primary'
    },
      {
        documentNo: 10001,
        date: '28.10.2019',
        time: '01:25:44 AM',
        type: 'Laboratory',
        physician: 'Dr. Ghassan Khayyat',
        status: 'On Review',
        statusCode: 1,
        class: 'task-primary'
      },
      {
        documentNo: 10002,
        date: '27.10.2019',
        time: '06:51:00 AM',
        type: 'Laboratory',
        physician: 'Dr. Yaman Tai',
        status: 'On Review',
        statusCode: 1,
        class: 'task-primary'
      },
      {
        documentNo: 10003,
        date: '29.10.2019',
        time: '12:51:05 AM',
        type: 'Microbiology',
        physician: 'Dr. Yaman Tai',
        status: 'On Review',
        statusCode: 1,
        class: 'task-warning'
      },
      {
        documentNo: 10004,
        date: '27.10.2019',
        time: '06:28:18 AM',
        type: 'Histopathology',
        physician: 'Dr. Violet Asfour',
        status: 'Ready',
        statusCode: 0,
        class: 'task-warning'
      });

    this.documentsOld = _data;
    let formattedDocuments = _.groupBy(_data, 'date');
    _.forEach(formattedDocuments, function (_document) {
      _document['lineItems'] = _document;
    });
    this.documents = formattedDocuments;
    console.log(this.documents);
  }

}
