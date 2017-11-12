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
      const currentMealId = this.meal.getValue()['id'];
      if (currentMealId.id === meal.id) this.meal.next(meal);
    })
  }

  getMeal(mealId: number) {
    return this.mealsService.getMeal(mealId).then((meal) => {
      meal.distractions = this.mealsService.formatMealItemsToCheckboxObject(meal.distractions);
      meal.beforeFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeFoods);
      meal.afterFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.afterFoods);
      meal.beforeEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeEmotions);
      meal.afterEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.afterEmotions);
      this.meal.next({...meal});
    });
  }

  clearMeal() {
    this.meal.next({});
  }
}
