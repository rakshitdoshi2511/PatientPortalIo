import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams, PopoverController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from "lodash";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss'],
})
export class InstructionComponent implements OnInit {

  model: any = {};
  constructor(
    private navParams: NavParams,
    private translate: TranslateService,
  ) { }

  getFontFamily(){
    return this.translate.getDefaultLang() == 'en' ? 'Futura-Medium' : 'Helvetica-Arabic-Medium';
  }
  ngOnInit() {
    this.model.data = this.navParams.data.instructionData;
    console.log(this.model.data);
    let _arr = '';
    if(this.model.data.length>0){
      _arr = _arr + '<div><p>';
      let ispreviousLine = false;
      _.forEach(this.model.data,function(obj){
        if(obj.TDFORMAT == '*'){
          _arr += '<br/>' + obj.TDLINE;
        }
        if(obj.TDFORMAT == ''){
          _arr += ' ' + obj.TDLINE;
        }
      });
      _arr += '</p></div>';
      this.model.htmlContent = _arr;
    }
  }

}
