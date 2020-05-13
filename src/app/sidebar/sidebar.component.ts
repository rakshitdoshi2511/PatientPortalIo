import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './../services/api.service';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  version: string = "";
  model: any = {};
  appPages: any = [];

  constructor(
    private _api: ApiService,
    private translate: TranslateService,
    ) { }

  ngOnInit() {
    this.model.name = 'Joe Bonamassa';
    this.model.mrn = '1562';
    this.model.email = 'test@sap.com';

    let _pages = [{
      title: this.translate.instant('sidemenu_home'),
      url: '/home',
      iconName: 'home',
      iconPath: '../assets/icon/icon_home_blue.svg'
    },
    {
      title: this.translate.instant('sidemenu_lab'),
      url: "laboratory",
      iconName: 'card',
      iconPath: '../assets/icon/icon_flask_blue.svg'
    },
    {
      title: this.translate.instant('sidemenu_nutrition'),
      url: 'nutrition',
      iconName: 'person',
      iconPath: '../assets/icon/icon_nutrition_blue.svg'
    },
    {
      title: this.translate.instant('sidemenu_radiology'),
      url: 'radiology',
      iconName: 'notifications',
      iconPath: '../assets/icon/icon_radiology_blue.svg'
    },
    {
      title: this.translate.instant('sidemenu_medical'),
      url: 'medical-reports',
      iconName: 'notifications',
      iconPath: '../assets/icon/icon_report_blue.svg'
    }];
    console.log(_pages);
    this.appPages = _pages;
  }

  logOut(){
    
  }

  getImagePath(p){
    return p.iconPath;
  }

}
