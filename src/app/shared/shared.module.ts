import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [ RouterModule, CommonModule],
    declarations: [ UserPopoverComponent ],
    exports: [  UserPopoverComponent]
})

export class SharedModule {
    constructor () {}
}