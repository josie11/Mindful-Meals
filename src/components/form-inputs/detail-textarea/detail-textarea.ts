import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'detail-textarea',
  template: `
    <ion-item>
      <ion-label stacked><h2>{{title}}:</h2></ion-label>
      <ion-icon ios="ios-book" md="md-book" item-start color="secondary"></ion-icon>
      <ion-textarea [(ngModel)]="triggerDescription" (ionChange)="change()"></ion-textarea>
    </ion-item>
  `,
})
export class DetailTextareaComponent implements OnInit {
  @Input() title: string;
  @Input() triggerDescription: string;

  details: string = '';

  @Output() onDescriptionChange = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.details = this.triggerDescription;
  }

  change() {
    this.onDescriptionChange.emit({ value: this.details });
  }

}
