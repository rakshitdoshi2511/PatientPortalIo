import { Injectable } from '@angular/core';
import { environment } from "./../../environments/environment";
declare let localStorage: any;
declare let sessionStorage: any;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  public env: {
    production: boolean;
    url: string;
    ver: string;
  } = environment;

  isLoggedIn() {
    return this.getLocal("isLoggedIn");
  }

  getClient() {
    return 'DEV';  
  }

  getLocal(key: string, skipParse?) {
    var data = localStorage.getItem(this.env['app_prefix'] + key);
    //var data = sessionStorage.getItem(this.env['app_prefix'] + key);

    if (data) {
      if (!skipParse) {
        data = JSON.parse(data);
      }

      return data;
    }
  }

  setLocal(key: string, value: any, skipParse?) {
    if (!skipParse) {
      value = JSON.stringify(value);
    }

    localStorage.setItem(this.env['app_prefix'] + key, value);
    //sessionStorage.setItem(this.env['app_prefix'] + key, value);
  }

  remLocal(key) {
    localStorage.removeItem(this.env['app_prefix'] + key);
    //sessionStorage.removeItem(this.env['app_prefix'] + key);
  }
}
