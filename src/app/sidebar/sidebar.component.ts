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
      icon: '🏠',
      iconName: 'home'
    },
    {
      title: "Laboratory Reports",
      url: "laboratory",
      icon: "💸",
      iconName: 'card',
      iconPath: 'url(../assets/icon/icon_flask_blue.svg)'
    },
    {
      title: 'Nutrition',
      url: 'nutrition',
      icon: '👤',
      iconName: 'person',
      iconPath: 'url(../assets/icon/icon_flask_blue.svg)'
    },
    {
      title: 'Radiology',
      url: 'radiology',
      icon: '⚙️',
      iconName: 'notifications',
      iconPath: 'url(../assets/icon/icon_flask_blue.svg)'
    },
    {
      title: 'Medical Reports',
      url: 'medical-reports',
      icon: '⚙️',
      iconName: 'notifications',
      iconPath: 'url(../assets/icon/icon_flask_blue.svg)'
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
