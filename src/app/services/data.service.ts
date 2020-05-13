import { ApiService } from './api.service';
import { Response, Http, ResponseContentType } from '@angular/http';
import { WebService } from './web.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private _http: WebService,
    private _api: ApiService,
    private http: Http,
  ) { }

  login(_data) {
    let headers = {
      'X-Requested-With':'XMLHttpRequest',
      'Content-Type':'application/json'
    }

    return this._http.post('LOGINSESSIONSET', _data, headers)
      .map((response: Response) => {
        return response.json();
      });  

  }
}
