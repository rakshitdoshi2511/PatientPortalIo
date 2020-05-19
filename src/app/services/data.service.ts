import { ApiService } from './api.service';
import { Response, Http, ResponseContentType } from '@angular/http';
import { WebService } from './web.service';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data = [];

  constructor(
    private _http: WebService,
    private _api: ApiService,
    private http: Http,
    private storage: Storage,
  ) { }

  ignoreKeys(){
    return ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
  }
  keyValuePairs(object){
    var array = [];
			for (var key in object) {
				if (this.ignoreKeys().indexOf(key) < 0) {
					var value = object[key],
						float = parseFloat(value);
					array.push({
						key: key,
						value: value || ''
					});
				}
			}
			return array;
  }

  generateURL(entitySetName,params,filters,isPost,expandEntities,isExpand){
    let url = entitySetName;
    if (!isPost && params) params = this.keyValuePairs(params);
    if (!isPost && filters) filters = this.keyValuePairs(filters);
    if (!isPost && params) {
      url += '(';
      params.forEach(function(param, index) {
        if (index > 0) {
          url += ',';
        }
        url += param.key + "='" + encodeURIComponent(param.value) + "'";
      });
      url += ')';
    }
    if (!isPost && filters) {
      url += '?$filter=';
      filters.forEach(function(filter, index) {
        if (index > 0) {
          url += encodeURIComponent(' and ');
        }
        url += filter.key + encodeURIComponent(" eq '" + filter.value) + "'";
      });
    }
    if(isExpand){
      url += '?$expand=';
      let _expandedEntities = expandEntities.toString();
      url += _expandedEntities;
    }
    return url;
  }

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

  loadData(entitySetName,params,filters,isPost,expandEntities,isExpand){
    let headers = {
      // 'X-Requested-With':'XMLHttpRequest',
      // 'Content-Type':'application/json',
      // 'Accept':'application/json'
    }
    let _url = this.generateURL(entitySetName,params,filters,isPost,expandEntities,isExpand);
    return this._http.get(_url,{} , headers)
      .map((response: Response) => {
        return response.json();
    }); 
  }

  deleteSession(entitySetName,params,filters,isPost,expandEntities,isExpand){
    let headers = {
      
    }
    let _url = this.generateURL(entitySetName,params,filters,isPost,expandEntities,isExpand);
    return this._http.get(_url,{} , headers)
      .map((response: Response) => {
        return response.json();
    }); 
  }


  /**Getters and Setters*/
  setData(id,data){
    this.data[id] = data;
    this.storage.set(id,data);
  }

  getData(id){
    return this.data[id];
  }
  getStoredData(id,type){
    return this.storage.get(id).then((val)=>{
      if(type=='LAB'){
        return val.SESSIONTOLABDATA.results;
      }
    });
  }
}
