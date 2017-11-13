import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Range } from 'ionic-angular';

@Component({
  selector: 'range',
  template: `
    <ion-item>
      <ion-range #range [min]="min" [max]="max" step="1" snaps="true" [(ngModel)]="number" (ionChange)="change()" color="secondary">
        <ion-label range-left>{{min}}</ion-label>
        <ion-label range-right>{{max}}</ion-label>
      </ion-range>
    </ion-item>
  `,
})
export class RangeComponent implements OnInit, AfterViewInit {
  @Input() min: number | string;
  @Input() max: number | string;
  @Input() initialValue: number | string;
  @Input() name: string;

  @Output() onRangeChange = new EventEmitter();

  @ViewChild('range') range: Range;

  number;

  constructor() {
  }

  ngOnInit() {
    this.number = this.initialValue || this.min;
  }

  ngAfterViewInit() {
    this.range._createTicks();
  }

  change() {
    this.onRangeChange.emit({ name: this.name, number: this.number });
  }

}
