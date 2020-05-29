import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateUserPage } from './validate-user.page';

const routes: Routes = [
  {
    path: '',
    component: ValidateUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateUserPageRoutingModule {}
