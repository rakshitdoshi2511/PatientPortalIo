import { Component } from '@angular/core';
import { PopoverController,Platform } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { TranslateService } from '@ngx-translate/core';

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
  /*Default Methods*/
  ngOnInit(){
    this.model.laboratoryCount = 23;
    this.model.nutritionCount = 5;
    this.model.radiologyCount = 13;
    this.model.medicalCount = 45;
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

  /**Screen Interaction*/
  openProfile(event){
    this.presentPopover(event);
  }
}
