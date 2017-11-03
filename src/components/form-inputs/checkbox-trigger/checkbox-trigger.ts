import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';

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
export class CheckboxTriggerComponent implements OnDestroy, OnInit {
  @Input() ios: string;
  @Input() md: string;
  @Input() title: string;
  @Input() behaviorSubject;

  @Output() onClick = new EventEmitter();

  items: object = {};
  itemsSubscription;

  constructor() {
  }

  ngOnInit() {
    this.itemsSubscription = this.behaviorSubject.subscribe(items => this.items = items);
  }

  click() {
    this.onClick.emit();
  }

  ngOnDestroy() {
    this.itemsSubscription.unsubscribe();
  }

}
