import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'range',
  template: `
    <ion-item>
      <ion-range [min]="min" [max]="max" step="1" snaps="true" [(ngModel)]="number" (ionChange)="change()" color="secondary">
        <ion-label range-left>{{min}}</ion-label>
        <ion-label range-right>{{max}}</ion-label>
      </ion-range>
    </ion-item>
  `,
})
export class RangeComponent implements OnInit {
  @Input() min: number | string;
  @Input() max: number | string;
  @Input() name: string;

  @Output() onRangeChange = new EventEmitter();

  number;

  constructor() {
  }

  ngOnInit() {
    this.number = this.min;
  }

  change() {
    this.onRangeChange.emit({ name: this.name, number: this.number });
  }

}
