import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaboratoryPageRoutingModule } from './laboratory-routing.module';

import { LaboratoryPage } from './laboratory.page';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaboratoryPageRoutingModule,
    TranslateModule
  ],
  declarations: [LaboratoryPage],//,UserPopoverComponent],
  entryComponents: []//[UserPopoverComponent]
})
export class LaboratoryPageModule {}
