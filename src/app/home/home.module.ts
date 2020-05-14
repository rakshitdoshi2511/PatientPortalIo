import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule,
    
  ],
  declarations: [HomePage],//,UserPopoverComponent],
  entryComponents: []//[UserPopoverComponent]
})
export class HomePageModule {}
