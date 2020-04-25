import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import * as _ from "lodash";


@Component({
  selector: 'app-radiology',
  templateUrl: './radiology.page.html',
  styleUrls: ['./radiology.page.scss'],
})
export class RadiologyPage implements OnInit {

  model: any = {};
  documents: any;
  documentsOld: any;

  constructor(
    public popoverController: PopoverController,
  ) { }

  /**Dialog and Loaders*/
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: UserPopoverComponent,
      event: ev,
      translucent: true,
      animated: true,
    });
    return await popover.present();
  }
  /**Helper Methods */
  customSort(a, b) {
    //Do not do anything since originalOrder is not working;
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
  showFilters(){
    
  }
  /**Data API */
  loadData() {
    let _data = [];
    _data.push({
      documentNo: 10000,
      date: '27.10.2019',
      time: '06:28:18 AM',
      type: 'Radiology',
      physician: 'Dr. Suzanne Al Sayed',
      status: 'On Review',
      statusCode: 1,
      class: 'task-primary',
      documentType:'image',
    },
      {
        documentNo: 10001,
        date: '28.10.2019',
        time: '01:25:44 AM',
        type: 'Radiology',
        physician: 'Dr. Ghassan Khayyat',
        status: 'On Review',
        statusCode: 1,
        class: 'task-primary',
        documentType:'image',
      },
      {
        documentNo: 10002,
        date: '27.10.2019',
        time: '06:51:00 AM',
        type: 'Radiology',
        physician: 'Dr. Yaman Tai',
        status: 'On Review',
        statusCode: 1,
        class: 'task-primary',
        documentType:'report',
      },
      {
        documentNo: 10003,
        date: '29.10.2019',
        time: '12:51:05 AM',
        type: 'Radiology',
        physician: 'Dr. Yaman Tai',
        status: 'On Review',
        statusCode: 1,
        class: 'task-warning',
        documentType:'image',
      },
      {
        documentNo: 10004,
        date: '27.10.2019',
        time: '06:28:18 AM',
        type: 'Radiology',
        physician: 'Dr. Violet Asfour',
        status: 'Ready',
        statusCode: 0,
        class: 'task-warning',
        documentType:'report',
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
