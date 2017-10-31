import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the Modal Component page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'modal',
  templateUrl: 'modal.html',
})
export class ModalComponent {

  constructor(private viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
