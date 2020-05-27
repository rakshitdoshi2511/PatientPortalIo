import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private modalController:ModalController
  ) { }

  ngOnInit() {}

  dismiss(){
    this.modalController.dismiss();
  }

}
