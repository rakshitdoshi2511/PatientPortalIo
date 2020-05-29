import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../services/loader.service';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-validate-user',
  templateUrl: './validate-user.page.html',
  styleUrls: ['./validate-user.page.scss'],
})
export class ValidateUserPage implements OnInit {
  patnr: string;
  token: string;
  model: any = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private _loader:LoaderService,
    private _dataServices: DataService,
  ) { 
    this.patnr = this.route.snapshot.queryParamMap.get("patnr");
    this.token = this.route.snapshot.queryParamMap.get("token");
    
  }

  ngOnInit() {
    this.model.passwordGenerated = '';
    this.model.showScreen = false;
    let msg = this.translate.instant('dialog_title_generatepassword');
    this._loader.showLoader(msg);
    this.generatePassword();
  }

  generatePassword(){
    let that = this;
    let _data = {
      Patnr: this.patnr,
      Token: this.token,
    }

    that._dataServices.postData('FRGTPSWDGENSET', _data).subscribe(
      _success => {
        that._loader.hideLoader();
        let _obj = _success.d;
        this.model.passwordGenerated = _obj.Password;
        this.model.showScreen = true;
      }, _error => {
        that._loader.hideLoader();
        let errorObj = JSON.parse(_error._body);
        this.model.showScreen = false;
        Swal.fire({
          title: errorObj.error.code,
          text: errorObj.error.message.value,
          backdrop: false,
          icon: 'error',
          confirmButtonColor: 'rgb(87,143,182)'
        });
      }
    )
  }

  goBackToLogin(){
    this.router.navigateByUrl('login');
  }


}
