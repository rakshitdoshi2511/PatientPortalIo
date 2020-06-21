import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as print from 'print-js'

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss'],
})
export class PdfViewComponent implements OnInit {
  pdfSrc: any = "";
  pdfRaw: any = "";
  model: any = {};
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private translate: TranslateService,
    private platform: Platform,
  ) { }

  /**Helper Methods */
  getFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Futura-Medium' : 'Helvetica-Arabic-Medium';
  }
  getFontFamilyAlert(){
    return this.translate.getDefaultLang() == 'en' ? 'font-english' : 'font-arabic';
  }  
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
    this.pdfRaw = this.navParams.data.data;
    this.platform.is('android') || this.platform.is('ios') || this.platform.is('iphone') ? this.model.isVisible = true
      : this.model.isVisible = false;
    // this.pdfSrc = './assets/files/Sample.pdf';
  }

  /**Screen Interaction */
  downloadPDF() {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      let _data = this.pdfRaw;
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
      let _data = this.pdfRaw;
      var blob = this.b64toBlob(_data, 'application/octet-stream');
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', this.model.documentNumber + ".pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  printPDF() {
    print({printable: this.pdfRaw, type: 'pdf', base64: true});
    // let _data = this.pdfRaw;
    // var winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,' +
    //   'resizable,screenX=50,screenY=50,width=850,height=1050';
    // var htmlPop = '<embed width=100% height=100%'
    //   + ' type="application/pdf"'
    //   + ' src="data:application/pdf;base64,'
    //   + escape(_data)
    //   + '"></embed>';

    // var printWindow = window.open("", "PDF", winparams);
    // printWindow.document.write(htmlPop);
    // printWindow.print();
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
