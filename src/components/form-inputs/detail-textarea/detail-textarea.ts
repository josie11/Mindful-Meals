import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'detail-textarea',
  template: `
    <ion-item>
      <ion-label stacked><h2>{{title}}:</h2></ion-label>
      <ion-icon ios="ios-book" md="md-book" item-start color="secondary"></ion-icon>
      <ion-textarea [(ngModel)]="details" (ionChange)="change()"></ion-textarea>
    </ion-item>
  `,
})
export class DetailTextareaComponent {
  @Input() title: string;

  details: string = '';

  @Output() onDescriptionChange = new EventEmitter();

  constructor() {
  }

  change() {
    this.onDescriptionChange.emit({ value: this.details });
  }

}
