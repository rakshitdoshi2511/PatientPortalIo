import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserPopoverComponent } from './user-popover/user-popover.component';
import { FilterPopoverComponent } from './filter-popover/filter-popover.component';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
    PdfViewComponent
  ],
  entryComponents: [
    UserPopoverComponent,
    FilterPopoverComponent,
    PdfViewComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    HttpClientModule, 
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
    DocumentViewer,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
