import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loader: HTMLIonLoadingElement;
  constructor(
    public loadingController:LoadingController
  ) { }

  async showLoader(_message): Promise<void>{
    if(this.loader){
      this.loader.dismiss();
      this.loader = await this.loadingController.create({
        message: _message,
      });
      await this.loader.present();
    }
    else{
      this.loader = await this.loadingController.create({
        message: _message,
      });
      await this.loader.present();
    }
  }
  async dismiss(){
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
  hideLoader() {
    //this.loader.dismiss(); 
    setTimeout(() => {
      this.loader.dismiss();
    }, 500);
  }
  
}
