import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalProvider } from '../../providers/modal';
import { BeforeFormPage } from '../log-forms/before-form/before-form';

@Component({
  selector: 'log-home',
  templateUrl: 'log-home.html'
})
export class LogHomePage {

  constructor(public navCtrl: NavController, private modalProvider: ModalProvider) {
  }

  presentBeforeFormModal() {
    this.modalProvider.presentModal(BeforeFormPage);
  }

}
