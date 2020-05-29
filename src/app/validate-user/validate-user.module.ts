import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidateUserPageRoutingModule } from './validate-user-routing.module';

import { ValidateUserPage } from './validate-user.page';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidateUserPageRoutingModule,
    TranslateModule
  ],
  declarations: [ValidateUserPage]
})
export class ValidateUserPageModule {}
