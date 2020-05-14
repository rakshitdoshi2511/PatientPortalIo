import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalReportsPageRoutingModule } from './medical-reports-routing.module';

import { MedicalReportsPage } from './medical-reports.page';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalReportsPageRoutingModule,
    TranslateModule
  ],
  declarations: [MedicalReportsPage]
})
export class MedicalReportsPageModule {}
