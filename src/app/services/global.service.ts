import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public sessionTimeout: number;

  constructor() { 
    this.sessionTimeout = 300; //Deafult timeout session is 
  }
}
