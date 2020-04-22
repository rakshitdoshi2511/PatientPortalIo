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
      title: "Price Setting",
      url: "price-setting-overview",
      icon: "💸",
      iconName: 'card'
    },
    {
      title: 'My Profile',
      url: 'profile',
      icon: '👤',
      iconName: 'person'
    },
    {
      title: 'Notifications',
      url: 'notification',
      icon: '⚙️',
      iconName: 'notifications'
    }
    // ,{
    //   title: "Map",
    //   url: "/map",
    //   icon: "🗺️"
    // }

  ];

  constructor(private _api: ApiService) { }

  ngOnInit() {}

  logOut(){
    
  }

}
