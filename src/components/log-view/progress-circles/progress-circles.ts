import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-circles',
  template: `
    <div class="progress-container">
      <div class="progress-wrapper">
      <h4>{{progressData1.title}}</h4>
      <p>{{progressData1.description}}</p>
        <div class="progress-bar">
          <p class="current">{{progressData1.current}}/{{progressData1.current}}</p>
          <round-progress
            [current]="progressData1.current"
            [max]="progressData1.max"
            [color]="'#45ccce'"
            [background]="'#eaeaea'"
            [radius]="45"
            [stroke]="15"
            [rounded]="false"
            [clockwise]="false"
            [duration]="800"
            [animation]="'easeInOutQuart'"
            [animationDelay]="0"
            responsive="true"
            ></round-progress>
        </div>
      </div>
      <div class="progress-wrapper">
      <h4>{{progressData2.title}}</h4>
      <p>{{progressData2.description}}</p>
      <div class="progress-bar">
        <p class="current">{{progressData2.current}}/{{progressData2.current}}</p>
        <round-progress
          [current]="progressData2.current"
          [max]="progressData2.max"
          [color]="'#45ccce'"
          [background]="'#eaeaea'"
          [radius]="45"
          [stroke]="15"
          [rounded]="false"
          [clockwise]="false"
          [duration]="800"
          [animation]="'easeInOutQuart'"
          [animationDelay]="0"
          responsive="true"
          ></round-progress>
      </div>
    </div>
    </div>
  `
})
export class ProgressCirclesComponent {
  @Input() progressData1: object;
  @Input() progressData2: object;



  constructor() {
    console.log(this)
  }

}
