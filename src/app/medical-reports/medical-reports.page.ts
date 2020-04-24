import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import * as _ from "lodash";

@Component({
  selector: 'app-medical-reports',
  templateUrl: './medical-reports.page.html',
  styleUrls: ['./medical-reports.page.scss'],
})
export class MedicalReportsPage implements OnInit {
  model: any = {};
  documents: any;
  documentsOld: any;
  emergencyDocuments: any;
  physicanDocuments: any;
  medicalDocuments: any;
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
  showFilters() {
    alert("ShowFilters");
  }
  filterDocuments(type) {
    console.log(type);
    let that = this;
    switch (type) {
      case 'ALL':
        this.model.selectedAll = 'tab-selected';
        this.model.selectedEmergency = '';
        this.model.selectedPhysician = '';
        this.model.selectedMedical = '';

        let formattedDocuments = _.groupBy(that.documentsOld, 'date');
        _.forEach(formattedDocuments, function (_document) {
          _document['lineItems'] = _document;
        });
        that.documents = formattedDocuments;

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
        that.documents = _emergencyDocuments;

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
        that.documents = _physicianDocuments;

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
        that.documents = _medicalDocuments;
        break;
    }
  }
  /**Data API */
  loadData() {
    let _data = [];
    _data.push({
      documentNo: 10000,
      date: '27.10.2019',
      time: '06:28:18 AM',
      type: 'Emergency Discharge Report',
      typeCode: 'EME',
      physician: 'Dr. Suzanne Al Sayed',
      status: 'On Review',
      statusCode: 1,
      class: 'task-primary'
    },
      {
        documentNo: 10001,
        date: '28.10.2019',
        time: '01:25:44 AM',
        type: 'Physician Discharge Report',
        typeCode: 'PHY',
        physician: 'Dr. Ghassan Khayyat',
        status: 'On Review',
        statusCode: 1,
        class: 'task-primary'
      },
      {
        documentNo: 10002,
        date: '27.10.2019',
        time: '06:51:00 AM',
        type: 'Medical Record',
        typeCode: 'MED',
        physician: 'Dr. Yaman Tai',
        status: 'On Review',
        statusCode: 1,
        class: 'task-primary'
      },
      {
        documentNo: 10003,
        date: '29.10.2019',
        time: '12:51:05 AM',
        type: 'Physician Discharge Report',
        typeCode: 'PHY',
        physician: 'Dr. Yaman Tai',
        status: 'On Review',
        statusCode: 1,
        class: 'task-warning'
      },
      {
        documentNo: 10004,
        date: '27.10.2019',
        time: '06:28:18 AM',
        type: 'Emergency Discharge Report',
        typeCode: 'EME',
        physician: 'Dr. Violet Asfour',
        status: 'Ready',
        statusCode: 0,
        class: 'task-warning'
      });

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
    this.documents = formattedDocuments;
    this.filterDocuments('ALL');
    console.log(this.documents);
  }

}
