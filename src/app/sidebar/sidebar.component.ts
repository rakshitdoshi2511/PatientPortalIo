import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './../services/api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  version: string = "";
  model: any = {};
  appPages = [
    {
      title: 'Home',
      url: '/home',
      iconName: 'home',
      iconPath: '../assets/icon/icon_home_blue.svg'
    },
    {
      title: "Laboratory Reports",
      url: "laboratory",
      iconName: 'card',
      iconPath: '../assets/icon/icon_flask_blue.svg'
    },
    {
      title: 'Nutrition',
      url: 'nutrition',
      iconName: 'person',
      iconPath: '../assets/icon/icon_nutrition_blue.svg'
    },
    {
      title: 'Radiology',
      url: 'radiology',
      iconName: 'notifications',
      iconPath: '../assets/icon/icon_radiology_blue.svg'
    },
    {
      title: 'Medical Reports',
      url: 'medical-reports',
      iconName: 'notifications',
      iconPath: '../assets/icon/icon_report_blue.svg'
    }
    
  ];

  constructor(private _api: ApiService) { }

  ngOnInit() {
    this.model.name = 'Joe Bonamassa';
    this.model.mrn = '1562';
    this.model.email = 'test@sap.com';
  }

  logOut(){
    
  }

  getImagePath(p){
    return p.iconPath;
  }

}
