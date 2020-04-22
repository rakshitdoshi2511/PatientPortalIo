import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalReportsPage } from './medical-reports.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalReportsPageRoutingModule {}
