import { Component, Input } from '@angular/core';

@Component({
  selector: 'log-view-section',
  template: `
    <ion-list>
      <ion-list-header>
        {{title}}
      </ion-list-header>
      <ion-item>
        <progress-circles
          [progressData1]="progressData1"
          [progressData2]="progressData2"
        ></progress-circles>
      </ion-item>
      <ion-item text-wrap>
        <ion-icon ios="ios-happy" md="md-happy" color="secondary" item-start></ion-icon>
        <h4>Emotions</h4>
        <p>
          {{(emotions | getValues | sortStrings).join(', ')}}
        </p>
      </ion-item>
      <ion-item text-wrap>
        <ion-icon ios="ios-nutrition" md="md-nutrition" color="secondary" item-start></ion-icon>
        <h4>Foods Craved</h4>
        <p>
          {{(foods | getValues | sortStrings).join(', ')}}
        </p>
      </ion-item>
      <ion-item text-wrap *ngIf="distractions">
        <ion-icon ios="ios-laptop" md="md-laptop" color="secondary" item-start></ion-icon>
        <h4>Distractions</h4>
        <p>
          {{(distractions | getValues | sortStrings).join(', ')}}
        </p>
      </ion-item>
      <ion-item text-wrap>
        <h4>{{descriptionTitle}}</h4>
        <p>
          {{description}}
        </p>
      </ion-item>
    </ion-list>
  `
})
export class LogViewSectionComponent {
  @Input() progressData1: object;
  @Input() progressData2: object;
  @Input() title: string;
  @Input() emotions: object;
  @Input() foods: object;
  @Input() distractions: object;
  @Input() descriptionTitle: string;
  @Input() description: string;



  constructor() {
  }

}
