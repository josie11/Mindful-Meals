import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(public alertCtrl: AlertController) {
  }

  //inputs => [{ name, placeholder }]
  presentPrompt({ title, inputs, cancelButtonText = 'Cancel', submitButtonText = 'Submit', submitHandler = (data) => {}, cancelHandler = () => {} }) {
    const alert = this.alertCtrl.create({
      title,
      inputs,
      buttons: [
        {
          text: cancelButtonText,
          role: 'cancel',
          handler: cancelHandler
        },
        {
          text: submitButtonText,
          handler: (data: any) => {
            submitHandler(data.emotion)
          }
        }
      ]
    });
    alert.present();
  }
}
