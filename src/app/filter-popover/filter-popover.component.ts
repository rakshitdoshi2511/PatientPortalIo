import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams } from '@ionic/angular';

@Component({
  selector: 'app-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss'],
})
export class FilterPopoverComponent implements OnInit {

  statusFilter: any = [];
  documentTypesFilter:any = [];
  physicianFilter:any = [];
  model:any={};

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    console.log("I am called");
    let that = this;
    that.statusFilter = this.navParams.data.status;
    that.documentTypesFilter = this.navParams.data.type;
    that.physicianFilter = this.navParams.data.physicians;
    console.log(that.statusFilter);
    console.log(that.documentTypesFilter);
    console.log(that.physicianFilter);
  }

  applyFilters(){
    let that = this;
    console.log(this.model.status);
    let setFilter = {
      status: that.model.status,
      physician: that.model.physician,
      type:that.model.type
    }
    this.modalController.dismiss({
      'dismissed':true
    });
    //that.modalController.dismiss(setFilter);
   // this.modalController.dismiss(setFilter,null,null);
  }

  clearFilters(){
    this.model = {};
    this.modalController.dismiss(null,'cancel');
  }

}
