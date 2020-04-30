import { Component, OnInit, TemplateRef } from '@angular/core';
import { LoaderService } from './../services/loader.service';
import { ApiService } from './../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  model: any = {};
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _loader: LoaderService,
    private _api: ApiService,

  ) { }

  /**Screen Interactions */
  onLogin() {
    this._api.setLocal('isLoggedIn', true);
    this.router.navigateByUrl('home');
  }
  ngOnInit() {
  }

  login(){
    this.onLogin();
  }

}
