import { Injectable } from '@angular/core';
import { MealsService } from './meals.service';
import { CravingsService } from './craving.service';
import { FormService } from './form.service';
import { BehaviorSubject } from "rxjs";
import {
    Craving,
    Meal,
    LogCraving,
    LogMeal,
  } from '../common/types';

import 'rxjs/add/operator/map';

/*
  Generated class for the LogService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LogService {

  meal: BehaviorSubject<object | LogMeal> = new BehaviorSubject({});
  craving: BehaviorSubject<object | LogCraving> = new BehaviorSubject({});

  constructor(
    private mealsService: MealsService,
    private cravingsService: CravingsService,
    private formService: FormService
  ) {
    this.mealsService.mealUpdated.subscribe((meal: Meal) => {
      const currentMeal: any = this.meal.getValue();
      if (currentMeal.id === meal.id) this.formatAndUpdateMeal(meal);
    })

    this.cravingsService.cravingUpdated.subscribe((craving: Craving) => {
      const currentCraving: any = this.craving.getValue();
      if (currentCraving.id === craving.id) this.formatAndUpdateCraving(craving);
    })
  }

  /**
   * Gets a meal by Id, formats items (meal foods, emotions, distractions),
   * and updates meal behavior subject with results.
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
    return this.cravingsService.getCraving(cravingId).then((craving: Craving) => this.formatAndUpdateCraving(craving));
  }

  /**
   * Gets the next CLOSEST craving in date/time, or undefined as may not exist.
   * Updates craving behavior subject with results if any.
   * Gets all craving foods, emotions.
   *
   * @return {(object|undefined)} returns a craving object with items formatted into object if exists in database, or undefined. There may be no next date.
  */
  getNextCraving() {
    const craving: any = this.craving.getValue();
    return this.cravingsService.getNextCraving(craving.id, craving.cravingDate, craving.cravingTime).then((craving: Craving) => this.formatAndUpdateCraving(craving));
  }

  /**
   * Gets the previous CLOSEST craving in date/time, or undefined as may not exist.
   * Updates craving behavior subject with results if any.
   * Gets all craving foods, emotions.
  */
  getPreviousCraving() {
    const craving: any = this.craving.getValue();
    return this.cravingsService.getPreviousCraving(craving.id, craving.cravingDate, craving.cravingTime).then((craving: Craving) => this.formatAndUpdateCraving(craving));
  }

  /**
   * Gets the form subscription from form Service
   *
   * @return {BehaviorSubject} form behavior subject from form service.
  */
  getFormSubscription() {
    return this.formService.form;
  }

  /**
   * Takes meal and formats results and updates behavior subject. Does nothing
   * if no meal is passed.
   * @param {meal} takes meal object and formats items and updates meal behavior subject.
  */
  formatAndUpdateMeal(meal: Meal) {
    if (!meal) return;

    const distractions = this.mealsService.formatMealItemsToCheckboxObject(meal.distractions);
    const beforeFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeFoods);
    const afterFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.afterFoods);
    const beforeEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeEmotions);
    const afterEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.afterEmotions);

    const updatedMeal: LogMeal = {...meal, distractions, beforeFoods, afterFoods, beforeEmotions, afterEmotions}
    this.meal.next(updatedMeal);
  }

  /**
   * Takes craving and formats results and updates behavior subject.
   * Does nothing if no craving is passed.
   * @param {craving} takes craving object and formats items and updates craving behavior subject.
  */
  formatAndUpdateCraving(craving: Craving) {
    if (!craving) return;

    const foods = this.mealsService.formatMealItemsToCheckboxObject(craving.foods);
    const emotions = this.mealsService.formatMealItemsToCheckboxObject(craving.emotions);

    const updatedCraving: LogCraving = {...craving, foods, emotions};
    this.craving.next(updatedCraving);
  }

  /**
   * Deletes a meal.
   *
   * @param {mealId} meal id of meal to delete.
   * @param {mealDate} date of meal, to trigger diary view refresh.
   *
  */
  deleteMeal(mealId: number, mealDate: string) {
    return this.mealsService.deleteMeal(mealId)
    .then(() => this.mealsService.mealDeleted.next({ id: mealId, mealDate }));
  }


  /**
   * Deletes a craving.
   *
   * @param {cravingId} craving id of craving to delete.
   * @param {cravingDate} date of craving, to trigger diary view refresh.
   *
  */
  deleteCraving(cravingId: number, cravingDate: string) {
    return this.cravingsService.deleteCraving(cravingId)
    .then(() => this.cravingsService.cravingDeleted.next({ id: cravingId, cravingDate }));
  }

  /**
   * Returns before item behavior subjects from form service.
   * Used for editing a log.
   * @return {object} object with behavior subjects.
  */
  getBeforeItemsBehaviorSubjects() {
    return {
      selectedBeforeFoods: this.formService.selectedBeforeFoods,
      selectedBeforeEmotions: this.formService.selectedBeforeEmotions
    };
  }

  /**
   * Updates form behavior subjects for selected items (emotion/foods/distractions) on form service
   * to that of current meal. Needed for editing log, form service is where all editing filters through.
  */
  updateFormToMeal() {
    const meal: any = this.meal.getValue();

    this.formService.updateFormToCompletedMeal(
      meal,
      meal.beforeEmotions,
      meal.afterEmotions,
      meal.beforeFoods,
      meal.afterFoods,
      meal.distractions
    );
  }

  /**
   * Updates form behavior subjects for selected before items (emotion/foods) on form service
   * Updates form to craving on form service. to that of current craving. Needed for editing log,
   * form service is where all editing filters through.
  */
  updateFormToCraving() {
    const craving: any = this.craving.getValue();

    this.formService.updateFormToCraving(craving, craving.emotions, craving.foods);
  }

  /**
   * Can edit meal/craving log using form service within log view.
   * @param {item} property on form to edit.
   *
   * @param {value} value to assign.
  */
  onFormItemChange(item, value) {
    this.formService.updateFormItem(item, value);
  }

  /**
   * Clear form on form service when a log is closed/edit mode canceld.
  */
  clearLogChanges() {
    this.formService.clearAfterForm();
  }

   /**
   * Submits any edits to the meal log via the form service.
  */
  submitMealChanges() {
    const meal: any = this.meal.getValue();

    return this.formService.submitMealUpdates(meal.id, meal.beforeEmotions, meal.beforeFoods, meal.afterEmotions, meal.afterFoods, meal.distractions)
    .then(() => this.clearLogChanges())
  }

  /**
   * Submits any edits to the craving log via the form service.
  */
  submitCravingChanges() {
    const craving: any = this.craving.getValue();

    return this.formService.submitCravingUpdates(craving.id, craving.emotions, craving.foods)
    .then(() => this.clearLogChanges())
  }

  /**
   * Clears the meal behavior subject and any edits stored in form service.
  */
  clearMeal() {
    this.meal.next({});
    this.clearLogChanges();
  }

  /**
   * Clears the cravings behavior subject and any edits stored in form service.
  */
  clearCraving() {
    this.craving.next({});
    this.clearLogChanges();
  }
}
