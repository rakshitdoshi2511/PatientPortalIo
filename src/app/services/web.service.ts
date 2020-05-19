import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/timeout'

//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import * as _ from "lodash";
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';

declare let localStorage:any;

@Injectable({
  providedIn: 'root'
})
export class WebService {

  Authorization: string;
  token: string;
  baseUrl: string;

  constructor(
    private http: Http, 
    private API: ApiService,
    private _http: HttpClient,
    private HTTP: HTTP,
    private platform: Platform) {
      this.baseUrl = environment.url;
  }

  createAuthorizationHeader(headers: Headers, customeHeaders?:any, type?:any) {  

      _.forEach(customeHeaders, function(_h,_k){
          headers.append(_k,_h);
      })
  }


  get(url:string ,custHeaders?:any ,params?:any, search?:any)
  get(url:string ,custHeaders?:any ,params?:any)
  get(url:string ,custHeaders?:any )
  get(url:string )
  get(){
      let _url = arguments[0]
      let url = this.baseUrl + _url;
      let custHeaders = arguments[1];
      let params = arguments[2];
      let search = arguments[3];

      let headers = new Headers();
      this.createAuthorizationHeader(headers,custHeaders, 'get');

      let options: RequestOptions = new RequestOptions({
          url: url,
          headers: headers,
          params: params,
          search: search
      });

    //   return this.http.get(url, options).timeout(60000)
      return this.http.get(url, options); 
  }
  
  post(url)
  post(url,data)
  post(url,data,custHeaders)
  post(url,data,custHeaders,params)
  post(){

      let login = false;
      let _url = arguments[0]

      let url = this.baseUrl + _url;
      let data = !arguments[1] ? {} : arguments[1];

      let custHeaders = !arguments[2] ? {} : arguments[2];
      let params = !arguments[3] ? {} : arguments[3]; 

      let headers = new Headers();
      console.log(data);
      this.createAuthorizationHeader(headers,custHeaders, 'post');

      let options: RequestOptions = new RequestOptions({
          url: url,
          headers: headers,
          params: params
      });
    //   return this.http.post(url, data, options).timeout(60000)
      return this.http.post(url, data, options);

      //return this._http.post(url,data);
      
  }

  delete(url:string ,custHeaders?:any ,params?:any, search?:any)
  delete(url:string ,custHeaders?:any ,params?:any)
  delete(url:string ,custHeaders?:any )
  delete(url:string )
  delete(){
      let _url = arguments[0]
      let url = this.baseUrl + _url;
      let custHeaders = arguments[1];
      let params = arguments[2];
      let search = arguments[3];

      let headers = new Headers();
      this.createAuthorizationHeader(headers,custHeaders, 'get');

      let options: RequestOptions = new RequestOptions({
          url: url,
          headers: headers,
          params: params,
          search: search
      });
      return this.http.get(url, options).toPromise(); 
  }
}
