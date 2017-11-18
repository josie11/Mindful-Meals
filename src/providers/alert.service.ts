import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the AlertService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertService {

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
          handler: (data: any) => submitHandler(data),
        }
      ]
    });
    alert.present();
  }

  //inputs => [{type, value, label, checked: boolean}]
  presentRadio({ title, inputs, cancelButtonText = 'Cancel', submitButtonText = 'Submit', submitHandler = (data) => {}, cancelHandler = () => {} }) {
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
          handler: (id: number) => {
            submitHandler(id)
          }
        }
      ]
    });
    alert.present();
  }

  presentConfirm({ title, message, cancelButtonText = 'Cancel', submitButtonText = 'Submit', submitHandler = (data) => {}, cancelHandler = () => {}}) {
    let alert = this.alertCtrl.create({
      title,
      message,
      buttons: [
        {
          text: cancelButtonText,
          role: 'cancel',
          handler: cancelHandler
        },
        {
          text: submitButtonText,
          handler: submitHandler
        }
      ]
    });
    alert.present();
  }
}
