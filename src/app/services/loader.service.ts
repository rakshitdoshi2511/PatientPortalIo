import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loader: HTMLIonLoadingElement;
  isLoading = false;
  
  constructor(
    public loadingController:LoadingController,
    public translate: TranslateService,
  ) { }

  async showLoader(_message): Promise<void>{
    if(this.loader){
      // setTimeout(()=>{
      //   this.loader.dismiss();
      // },1000);
      this.loader.dismiss();
      this.loader = await this.loadingController.create({
        message: _message,
        cssClass:this.translate.getDefaultLang()=='en'?'font-english':'font-arabic'
      });
      await this.loader.present();
    }
    else{
      this.loader = await this.loadingController.create({
        message: _message,
        cssClass:this.translate.getDefaultLang()=='en'?'font-english':'font-arabic'
      });
      await this.loader.present();
    }
  }
  async dismiss(){
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  } 

  async disMissLoader(){
    return await this.loadingController.getTop().then((e)=>{
      e&&e.dismiss().then(()=> console.log("Dismiss"));
    })
  }

  hideLoader() {
    //this.loader.dismiss(); 
    setTimeout(() => {
      this.loader.dismiss();
    }, 200);
  }
  
}
