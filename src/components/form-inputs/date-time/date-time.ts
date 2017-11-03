import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'date-time',
  template: `
    <ion-item>
      <ion-icon ios="ios-calendar" md="md-calendar" item-start color="secondary"></ion-icon>
      <ion-label>Date</ion-label>
      <ion-datetime displayFormat="MMM DD, YYYY" pickerFormat="MMM DD YYYY" [placeholder]="date" [(ngModel)]="date" (ionChange)="onChange('date')"></ion-datetime>
    </ion-item>
    <ion-item>
      <ion-icon ios="ios-time" md="md-time" item-start color="secondary"></ion-icon>
      <ion-label>Time</ion-label>
      <ion-datetime displayFormat="h:mm A" [placeholder]="time" [(ngModel)]="time" (ionChange)="onChange('time')">
      </ion-datetime>
    </ion-item>
  `,
  providers: [DatePipe]
})
export class DateTimeComponent implements OnInit {
  time: string;
  date: string;

  @Output() onTimeDateChange = new EventEmitter();

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit() {
    //automatically generate date/time to current for form
    this.date = this.datePipe.transform(new Date(), 'mediumDate');
    this.onTimeDateChange.emit({ type: 'date', value: this.date });

    this.time = this.datePipe.transform(new Date(), 'shortTime');
    this.onTimeDateChange.emit({ type: 'time', value: this.time });
  }

  onChange(type) {
    this.onTimeDateChange.emit({ type, value: this[type] });
  }

}
