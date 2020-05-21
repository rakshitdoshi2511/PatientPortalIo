import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
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
  b64toBlob(b64Data?: any, contentType?: any, sliceSize?: any) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  /**Default Method */
  ngOnInit() {
    let response = this.navParams.data.data;
    this.model.documentNumber = this.navParams.data.documentNo;
    this.pdfSrc = this.base64ToArrayBuffer(response);
    // this.pdfSrc = './assets/files/Sample.pdf';
  }

  /**Screen Interaction */
  downloadPDF() {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      let _data = this.pdfSrc;
      const byteCharacters = atob(_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/octet-stream' });
      window.navigator.msSaveBlob(blob, this.model.documentNumber + ".pdf");
    }
    else {
      let _data = this.pdfSrc;
      var blob = this.b64toBlob(_data, 'application/octet-stream');
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', this.model.documentNumber + ".pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
