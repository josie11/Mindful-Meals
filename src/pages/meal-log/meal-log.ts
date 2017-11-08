import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MealsService} from '../../providers/meals.service';
import { CravingsService} from '../../providers/craving.service';
import { DiaryService } from '../../providers/diary.service';

@Component({
  selector: 'meal-log-page',
  templateUrl: 'meal-log.html'
})
export class MealLogPage implements OnInit, OnDestroy {

  constructor(public navCtrl: NavController, public mealsService: MealsService, public cravingsService: CravingsService, private diaryService: DiaryService) {
  }

  dismiss() {
    this.navCtrl.pop();
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
