import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams, PopoverController } from '@ionic/angular';

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
    private popoverController: PopoverController
  ) { }

  /**Helper Methods */
  compareWithFunctionStatus = (o1,o2) => {
    return  o1 && o2 ? o1.statusCode === o2.statusCode: o1 === o2;
  }
  compareWithFunctionPhysician = (o1,o2) => {
    return  o1 && o2 ? o1.physician === o2.physician: o1 === o2;
  }
  compareWithFunctionType = (o1,o2) => {
    return  o1 && o2 ? o1.type === o2.type: o1 === o2;
  }
  compareWithStatus = this.compareWithFunctionStatus;
  compareWithPhysician = this.compareWithFunctionPhysician;
  compareWithType = this.compareWithFunctionType;

  /**Default Methods */
  ngOnInit() {
    let that = this;
    that.model.statusFilterHidden = false;
    that.model.physicianFilterHidden = false;
    that.model.documentTypeFilterHidden = false;
    that.id = this.navParams.data.id;
    that.statusFilter = this.navParams.data.status;
    
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
      console.log("I am here");
      that.model.documentTypeFilterHidden = true;
    }
    that.model.status = this.navParams.data.statusFilterValue;
    that.model.physician = this.navParams.data.physicianFilterValue;
    that.model.type = this.navParams.data.typeFilterValue;
  }
  ionViewDidEnter(){
    let that = this;
    that.model.statusFilterHidden = false;
    that.model.physicianFilterHidden = false;
    that.model.documentTypeFilterHidden = false;
    that.id = this.navParams.data.id;
    that.statusFilter = this.navParams.data.status;
    
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
      console.log("I am here");
      that.model.documentTypeFilterHidden = true;
    }
    that.model.status = this.navParams.data.statusFilterValue;
    that.model.physician = this.navParams.data.physicianFilterValue;
    that.model.type = this.navParams.data.typeFilterValue;
  }
  /**Screen Interaction */
  applyFilters(){
    let that = this;
    //console.log(this.model.status);
    let setFilter = {
      status: that.model.status,
      physician: that.model.physician,
      type:that.model.type
    }
    this.popoverController.dismiss(setFilter);
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
