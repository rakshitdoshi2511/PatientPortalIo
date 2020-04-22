import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalReportsPageRoutingModule } from './medical-reports-routing.module';

import { MedicalReportsPage } from './medical-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalReportsPageRoutingModule
  ],
  declarations: [MedicalReportsPage]
})
export class MedicalReportsPageModule {}
