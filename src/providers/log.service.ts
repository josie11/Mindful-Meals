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
      if (currentMeal.id === meal.id) this.formatAndUpdateMeal(meal);
    })

    this.formService.cravingUpdated.subscribe((craving: any) => {
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
    return this.cravingsService.getCraving(cravingId).then((craving) => {
      craving.foods = this.cravingsService.formatCravingItemsToCheckboxObject(craving.foods);
      craving.emotions = this.cravingsService.formatCravingItemsToCheckboxObject(craving.emotions);

      this.craving.next({...craving});
    });
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
    return this.cravingsService.getNextCraving(craving.id, craving.cravingDate, craving.cravingTime).then((craving) => this.formatAndUpdateCraving(craving));
  }

  /**
   * Gets the previous CLOSEST craving in date/time, or undefined as may not exist.
   * Updates craving behavior subject with results if any.
   * Gets all craving foods, emotions.
  */
  getPreviousCraving() {
    const craving: any = this.craving.getValue();
    return this.cravingsService.getPreviousCraving(craving.id, craving.cravingDate, craving.cravingTime).then((craving) => this.formatAndUpdateCraving(craving));
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
   * Takes craving and formats results and updates behavior subject.
   * Does nothing if no craving is passed.
   * @param {craving} takes craving object and formats items and updates craving behavior subject.
  */
  formatAndUpdateCraving(craving) {
    if (!craving) return;

    craving.foods = this.mealsService.formatMealItemsToCheckboxObject(craving.foods);
    craving.emotions = this.mealsService.formatMealItemsToCheckboxObject(craving.emotions);

    this.craving.next({...craving});
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
    this.formService.updateBeforeFoods(meal.beforeFoods);
    this.formService.updateBeforeEmotions(meal.beforeEmotions);
    this.formService.updateAfterFoods(meal.afterFoods);
    this.formService.updateAfterEmotions(meal.afterEmotions);
    this.formService.updateDistractions(meal.distractions);
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
   * Submits any edits to the craving log via the form service.
  */
  submitcravingChanges() {
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
