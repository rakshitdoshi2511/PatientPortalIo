import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RadiologyPageRoutingModule } from './radiology-routing.module';

import { RadiologyPage } from './radiology.page';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RadiologyPageRoutingModule,
    TranslateModule
  ],
  declarations: [RadiologyPage]
})
export class RadiologyPageModule {}
