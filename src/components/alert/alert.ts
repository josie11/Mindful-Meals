import { Component } from '@angular/core';

/**
 * Generated class for the AlertComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'alert',
  templateUrl: 'alert.html'
})
export class AlertComponent {

  text: string;

  constructor() {
    console.log('Hello AlertComponent Component');
    this.text = 'Hello World';
  }

}
