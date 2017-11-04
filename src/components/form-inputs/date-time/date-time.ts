import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'date-time',
  template: `
    <ion-item>
      <ion-icon ios="ios-calendar" md="md-calendar" item-start color="secondary"></ion-icon>
      <ion-label>Date</ion-label>
      <ion-datetime displayFormat="MMM DD, YYYY" pickerFormat="MMM DD, YYYY" [placeholder]="date | date:'mediumDate'" [(ngModel)]="date" (ionChange)="onDateChange()"></ion-datetime>
    </ion-item>
    <ion-item>
      <ion-icon ios="ios-time" md="md-time" item-start color="secondary"></ion-icon>
      <ion-label>Time</ion-label>
      <ion-datetime displayFormat="h:mm A" pickerFormat="h:mm A" [placeholder]="date + 'T' + time | date:'shortTime'" [(ngModel)]="time" (ionChange)="onTimeChange()">
      </ion-datetime>
    </ion-item>
  `,
  providers: [DatePipe]
})
export class DateTimeComponent implements OnInit {
  @Input() time: string;
  @Input() date: string;

  @Output() onTimeDateChange = new EventEmitter();

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit() {
    //automatically generate date/time to current for form
    if (!this.date) {
      this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.onTimeDateChange.emit({ type: 'date', value: this.date });
    }

    if (!this.time) {
      this.time = this.datePipe.transform(new Date(), 'HH:mm');
      this.onTimeDateChange.emit({ type: 'time', value: this.time });
    }
  }

  onDateChange() {
    this.onTimeDateChange.emit({ type: 'date', value: this.date });
  }

  onTimeChange() {
    this.onTimeDateChange.emit({ type: 'time', value: this.time });
  }

}
