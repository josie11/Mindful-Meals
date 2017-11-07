import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalService } from '../../providers/modal.service';
import { BeforeFormPage } from '../log-forms/before-form/before-form';
import { AfterFormPage } from '../log-forms/after-form/after-form';


@Component({
  selector: 'log-home',
  templateUrl: 'log-home.html'
})
export class LogHomePage {

  constructor(public navCtrl: NavController, private modalService: ModalService) {
  }

  presentBeforeFormModal() {
    this.modalService.presentModal(BeforeFormPage);
  }

  presentAfterFormModal() {
    this.modalService.presentModal(AfterFormPage);
  }

}
