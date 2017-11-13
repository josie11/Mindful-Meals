import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LogService } from '../../../providers/log.service';


@Component({
  selector: 'meal-log-page',
  templateUrl: 'meal-log.html'
})
export class MealLogPage implements OnInit, OnDestroy {

  meal: object = {};
  mealId: number;

  mealSubscription;

  constructor(public navCtrl: NavController, private navParams: NavParams, private logService: LogService) {
  }

  ngOnInit() {
    this.mealId = this.navParams.get('id');
    this.mealSubscription = this.logService.meal.subscribe((meal) => this.meal = meal);
    this.logService.getMealById(this.mealId).catch(console.error);
  }

  dismiss() {
    this.navCtrl.pop();
  }

  nextMeal() {
    this.logService.getNextMeal();
  }

  previousMeal() {
    this.logService.getPreviousMeal();
  }

  ngOnDestroy() {
    this.mealSubscription.unsubscribe();
    this.logService.clearMeal();
  }
}
