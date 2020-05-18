import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserPopoverComponent } from './user-popover/user-popover.component';
import { GradientWithRadialProgressCardComponent } from './gradient-with-radial-progress-card/gradient-with-radial-progress-card.component';
import { FilterPopoverComponent } from './filter-popover/filter-popover.component';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BnNgIdleService } from 'bn-ng-idle';
import { HttpModule, Http } from '@angular/http';
import { HTTP } from '@ionic-native/http/ngx';
import {GlobalService} from './services/global.service';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { Constant } from './constant';
//import { HttpModule, Http } from '@angular/http';
//import { SharedModule } from './shared/shared.module';

export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
 }

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    UserPopoverComponent,
    FilterPopoverComponent,
    GradientWithRadialProgressCardComponent,
    PdfViewComponent,
    CustomAlertComponent
  ],
  entryComponents: [
    UserPopoverComponent,
    FilterPopoverComponent,
    PdfViewComponent,
    GradientWithRadialProgressCardComponent,
    CustomAlertComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    HttpClientModule, 
    FormsModule,
    HttpModule,
    RoundProgressModule,
    TranslateModule.forRoot({
      loader: {
       provide: TranslateLoader,
       useFactory: (setTranslateLoader),
       deps: [HttpClient]
     }
    }),
    AppRoutingModule,
    PdfViewerModule
  ],
  providers: [
    BnNgIdleService,
    HTTP,
    GlobalService,
    DocumentViewer,
    StatusBar,
    Constant,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
