import { Injectable } from '@angular/core';
import { MealsService } from './meals.service';
import { CravingsService } from './craving.service';
import { FormService } from './form.service';
import { BehaviorSubject } from "rxjs";


import 'rxjs/add/operator/map';

/*
  Generated class for the LogService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LogService {

  meal: BehaviorSubject<object> = new BehaviorSubject({});
  craving: BehaviorSubject<object> = new BehaviorSubject({});

  constructor(private mealsService: MealsService, private cravingsService: CravingsService, private formService: FormService) {
    this.formService.mealUpdated.subscribe((meal: any) => {
      const currentMeal: any = this.meal.getValue();
      if (currentMeal.id === meal.id) this.meal.next(meal);
    })
  }

  getMealById(mealId: number) {
    return this.mealsService.getMeal(mealId).then((meal) => this.formatAndUpdateMeal(meal));
  }

  getNextMeal() {
    const meal: any = this.meal.getValue();
    return this.mealsService.getNextMeal(meal.id, meal.mealDate, meal.mealTime).then((meal) => this.formatAndUpdateMeal(meal));
  }

  getPreviousMeal() {
    const meal: any = this.meal.getValue();
    return this.mealsService.getPreviousMeal(meal.id, meal.mealDate, meal.mealTime).then((meal) => this.formatAndUpdateMeal(meal));
  }

  getCraving(cravingId: number) {
    return this.cravingsService.getCraving(cravingId).then((craving) => {
      craving.foods = this.mealsService.formatMealItemsToCheckboxObject(craving.foods);
      craving.emotions = this.mealsService.formatMealItemsToCheckboxObject(craving.emotions);

      this.craving.next({...craving});
    });
  }

  formatAndUpdateMeal(meal) {
    if (!meal) return;

    meal.distractions = this.mealsService.formatMealItemsToCheckboxObject(meal.distractions);
    meal.beforeFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeFoods);
    meal.afterFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.afterFoods);
    meal.beforeEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeEmotions);
    meal.afterEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.afterEmotions);
    this.meal.next({...meal});
  }

  clearMeal() {
    this.meal.next({});
  }

  clearCraving() {
    this.craving.next({});
  }
}
