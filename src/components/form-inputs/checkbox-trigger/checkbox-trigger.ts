import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'checkbox-trigger',
  template: `
    <ion-item detail-push (click)="click()">
      <ion-icon [ios]="ios" [md]="md" item-start color="secondary"></ion-icon>
      <h2>{{title}}</h2>
      <p>{{(items | getValues | sortStrings).join(', ')}}</p>
    </ion-item>
  `,
})
export class CheckboxTriggerComponent {
  @Input() ios: string;
  @Input() md: string;
  @Input() title: string;
  @Input() behaviorSubject;
  @Input() items: object;
  @Output() onClick = new EventEmitter();

  // items: object = {};
  itemsSubscription;

  constructor() {
  }

  click() {
    this.onClick.emit();
  }

}
