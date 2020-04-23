import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tiles: any = [];

  constructor(
    public popoverController: PopoverController,
  ) {}

  ngOnInit(){

  }
  ionViewDidEnter(){
    this.tiles.push(
      {id:1,title:'Laboratory',subtitle:'Access to the laboratory reports',icon:'icon-flask.svg',class:'',pendingDocuments:'',lastDate:''},
      {id:2,title:'Nutrition',subtitle:'Access to the nutrition care reports',icon:'icon-nutrition.svg',class:'',pendingDocuments:'',lastDate:''},
      {id:3,title:'Radiology',subtitle:'Access to the radiology reports and images',icon:'icon-radiology.svg',class:'',pendingDocuments:'',lastDate:''},
      {id:4,title:'Medical Reports',subtitle:'Access General Medical Reports, ER and Hospital Discharge reports',icon:'icon-report.svg',class:'',pendingDocuments:'',lastDate:''},
    );

  }

  async presentPopover(ev:any){
    const popover = await this.popoverController.create({
      component: UserPopoverComponent,
      event: ev,
      translucent: true,
      animated:true,
    });
    return await popover.present();
  }

  openProfile(event){
    this.presentPopover(event);
  }

}
