import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'date-switch-divider',
  template: `
    <ion-item-divider>
      <h2>{{date | date: 'MMM d, y'}}</h2>
      <p *ngIf="time">{{date | time}}</p>
      <p>{{mealType}}</p>
      <button ion-button icon-only item-start clear (click)="decrement()">
        <ion-icon ios="ios-arrow-back" md="md-arrow-back"></ion-icon>
      </button>
      <button ion-button icon-only item-end clear (click)="increment()">
        <ion-icon ios="ios-arrow-forward" md="md-arrow-forward"></ion-icon>
      </button>
    </ion-item-divider>
  `,
})
export class DateSwitchDividerComponent {
  @Input() date: string;
  @Input() time: boolean;
  @Input() mealType: string;

  @Output() onDateDecrement = new EventEmitter();
  @Output() onDateIncrement = new EventEmitter();

  constructor() {
  }

  decrement() {
    this.onDateDecrement.emit();
  }

  increment() {
    this.onDateIncrement.emit();
  }

}
