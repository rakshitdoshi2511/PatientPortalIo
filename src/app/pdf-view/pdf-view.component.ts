import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss'],
})
export class PdfViewComponent implements OnInit {
  pdfSrc: any = "";

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.pdfSrc = '../assets/files/Sample.pdf';
  }

  dismiss(){
    this.modalController.dismiss();
  }

}
