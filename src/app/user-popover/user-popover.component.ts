import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent implements OnInit {

  model: any = {};
  constructor(
    private translate: TranslateService,
    public popoverControl: PopoverController
  ) { }

  ngOnInit() {
    
    this.model.language = this.translate.getDefaultLang() == 'en'? true: false;
  }
  resetPassword(){}
  logOut(){}
  switchLanguage(){
    console.log(this.model.language);
    this.popoverControl.dismiss();
    this.model.language?this.translate.use('en'):this.translate.use('ar');
    this.model.language?this.translate.setDefaultLang('en'):this.translate.setDefaultLang('ar');
  }

}
