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

  /**
   * Gets a meal by Id, formats items (meal foods, emotions, distractions), and updates meal behavior subject with results.
   * @param {mealId} mealId - the id of the meal to get
  */
  getMealById(mealId: number) {
    return this.mealsService.getMeal(mealId).then((meal) => this.formatAndUpdateMeal(meal));
  }

  /**
   * Gets the next CLOSEST meal in date/time, or undefined as may not exist.
   * Updates meal behavior subject with results if any.
   * Gets all meal foods, emotions, distractions.
   *
   * @return {(object|undefined)} returns a meal object with items formatted into object if exists in database, or undefined. There may be no next date.
  */
  getNextMeal() {
    const meal: any = this.meal.getValue();
    return this.mealsService.getNextMeal(meal.id, meal.mealDate, meal.mealTime).then((meal) => this.formatAndUpdateMeal(meal));
  }

  /**
   * Gets the previous CLOSEST meal in date/time, or undefined as may not exist.
   * Updates meal behavior subject with results if any.
   * Gets all meal foods, emotions, distractions.
  */
  getPreviousMeal() {
    const meal: any = this.meal.getValue();
    return this.mealsService.getPreviousMeal(meal.id, meal.mealDate, meal.mealTime).then((meal) => this.formatAndUpdateMeal(meal));
  }

  /**
   * Gets a craving by Id, formats items (craving foods, emotions), and updates craving behavior subject with results.
   * @param {cravingId} cravingId - the id of the craving to get
  */
  getCraving(cravingId: number) {
    return this.cravingsService.getCraving(cravingId).then((craving) => {
      craving.foods = this.mealsService.formatMealItemsToCheckboxObject(craving.foods);
      craving.emotions = this.mealsService.formatMealItemsToCheckboxObject(craving.emotions);

      this.craving.next({...craving});
    });
  }

  /**
   * Takes meal and formats results and updates behavior subject. Does nothing if no meal is passed.
   * @param {meal} takes meal object and formats items and updates meal behavior subject.
  */
  formatAndUpdateMeal(meal) {
    if (!meal) return;

    meal.distractions = this.mealsService.formatMealItemsToCheckboxObject(meal.distractions);
    meal.beforeFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeFoods);
    meal.afterFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.afterFoods);
    meal.beforeEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeEmotions);
    meal.afterEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.afterEmotions);

    this.meal.next({...meal});
  }

  /**
   * Takes craving and formats results and updates behavior subject. Does nothing if no craving is passed.
   * @param {craving} takes craving object and formats items and updates craving behavior subject.
  */
  formatAndUpdateCraving(craving) {
    if (!craving) return;

    craving.foods = this.mealsService.formatMealItemsToCheckboxObject(craving.foods);
    craving.emotions = this.mealsService.formatMealItemsToCheckboxObject(craving.emotions);

    this.meal.next({...craving});
  }

  /**
   * Clears the meal behavior subject.
  */
  clearMeal() {
    this.meal.next({});
  }

  /**
   * Clears the cravings behavior subject.
  */
  clearCraving() {
    this.craving.next({});
  }
}
