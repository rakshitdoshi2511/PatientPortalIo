import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent implements OnInit {

  model: any = {};
  constructor() { }

  ngOnInit() {}
  resetPassword(){}
  logOut(){}
  switchLanguage(){
    console.log(this.model.language);
  }

}
