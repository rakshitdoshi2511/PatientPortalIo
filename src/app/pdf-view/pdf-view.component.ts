import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss'],
})
export class PdfViewComponent implements OnInit {
  pdfSrc: any = "";
  model: any = {};
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private translate: TranslateService,
  ) { }

  /**Helper Methods */

  base64ToArrayBuffer(base64) {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  ngOnInit() {
    let response = this.navParams.data.data;
    this.model.documentNumber = this.navParams.data.documentNo;
    this.pdfSrc = this.base64ToArrayBuffer(response);
    // this.pdfSrc = './assets/files/Sample.pdf';
  }

  dismiss(){
    this.modalController.dismiss();
  }

}
