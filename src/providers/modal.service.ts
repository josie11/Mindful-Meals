import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the ModalService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ModalService {

  constructor(public modalCtrl: ModalController) {

  }

  presentModal(modal, params = {}) {
    this.modalCtrl.create(modal, params).present();
  }

}
