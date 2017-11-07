import { Injectable } from '@angular/core';
import { EmotionsService } from './emotion.service';
import { FoodsService } from './food.service';
import { DistractionsService } from './distraction.service';
import { MealsService } from './meals.service';
import { CravingsService } from './craving.service';

import { BehaviorSubject } from "rxjs";

import 'rxjs/add/operator/map';

/*
  To assist with the emotions/distractions modal communication
  And to submit form when complete
*/
@Injectable()
export class FormService {

  selectedBeforeEmotions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedBeforeFoods: BehaviorSubject<object> = new BehaviorSubject({});

  selectedDistractions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedAfterEmotions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedAfterFoods: BehaviorSubject<object> = new BehaviorSubject({});

  constructor(
      private emotionsService: EmotionsService,
      private foodsService: FoodsService,
      private distractionsService: DistractionsService,
      private mealsService: MealsService,
      private cravingsService: CravingsService,
    ) {
  }

  updateBeforeEmotions(emotions) {
    this.selectedBeforeEmotions.next({...emotions});
  }

  updateAfterEmotions(emotions) {
    this.selectedAfterEmotions.next({...emotions});
  }

  addNewEmotion(name) {
    return this.emotionsService.addEmotion(name)
    .then((data: any) => ({id : data.id, name}));
  }

  updateBeforeFoods(foods) {
    this.selectedBeforeFoods.next({...foods});
  }

  updateAfterFoods(foods) {
    this.selectedAfterFoods.next({...foods});
  }

  addNewFood(name) {
    return this.foodsService.addFood(name)
    .then((data: any) => ({id : data.id, name}));
  }

  updateDistractions(distractions) {
    this.selectedDistractions.next({...distractions});
  }

  addNewDistraction(name) {
    return this.distractionsService.addDistraction(name)
    .then((data: any) => ({id : data.id, name}));
  }

  submitBeforeMealForm(data) {
    const { cols, values } = this.formatDataforInsert(data);

    return this.mealsService.addMeal(cols, values)
    .then((data: any) => {
      return this.linkBeforeFormItemsWithMeal(data.id)
      .then((data: any) => {
        this.clearBeforeForm();
        return this.mealsService.getMeal(data.id);
      });
    });
  }

  linkBeforeFormItemsWithMeal(id) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();

    return this.mealsService.addMealEmotions(id, selectedBeforeEmotionIds, 'before')
    .then(() => this.mealsService.addMealFoods(id, selectedBeforeFoodsIds, 'before'))
    .then(() => ({id: id}));
  }

  submitCravingForm(data) {
    const { cols, values } = this.formatDataforInsert(data);

    return this.cravingsService.addCraving(cols, values)
    .then((data: any) => {
      this.linkCravingItemsWithCraving(data.id)
      .then(() => {
        this.clearBeforeForm();
        return this.cravingsService.getCraving(data.id);
      });
    });
  }

  linkCravingItemsWithCraving(id) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();

    return this.cravingsService.addCravingEmotions(id, selectedBeforeEmotionIds)
    .then(() => this.cravingsService.addCravingFoods(id, selectedBeforeFoodsIds))
    .then(() => ({id: id}));
  }

  linkAfterItemsWithMeal(id) {
    const { selectedAfterEmotionIds, selectedAfterFoodsIds, selectedDistractionsIds } = this.getSelectedAfterItemsIds();

    return this.mealsService.addMealEmotions(id, selectedAfterEmotionIds, 'after')
    .then(() => this.mealsService.addMealFoods(id, selectedAfterFoodsIds, 'after'))
    .then(() => this.mealsService.addMealDistractions(id, selectedDistractionsIds))
    .then(() => ({id: id}));
  }

  updateBeforeMealItems(id, previousEmotions, previousFoods) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();
    const previousEmotionsIds = Object.keys(previousEmotions).map(val => Number(val));
    const previousFoodsIds = Object.keys(previousFoods).map(val => Number(val));

    return this.mealsService.updateMealEmotions(id, 'before', previousEmotionsIds, selectedBeforeEmotionIds)
    .then(() => this.mealsService.updateMealFoods(id, 'before', previousFoodsIds, selectedBeforeFoodsIds))
    .then(() => ({id: id}));
  }

  submitNewAfterMealForm(data) {
    return this.submitBeforeMealForm(data)
    .then((data: any) => this.linkAfterItemsWithMeal(data.id))
    .then((data: any) => {
      this.clearAfterForm();
      return this.mealsService.getMeal(data.id);
    });
  }

  submitAttachedMealAfterForm(mealId, data, beforeEmotions, beforeFoods ) {
    const mealData = this.formatDataForUpdate(data);

    return this.mealsService.updateMeal(mealId, mealData)
    .then(() => this.updateBeforeMealItems(mealId, beforeEmotions, beforeEmotions))
    .then(() => this.linkAfterItemsWithMeal(mealId))
    .then(() => {
      this.clearAfterForm();
      return this.mealsService.getMeal(mealId)
    });
  }

  clearBeforeForm() {
    this.selectedBeforeEmotions.next({});
    this.selectedBeforeFoods.next({});
  }

  clearAfterForm() {
    this.clearBeforeForm();
    this.selectedAfterEmotions.next({});
    this.selectedAfterFoods.next({});
    this.selectedDistractions.next({});
  }

  getSelectedBeforeItemsIds() {
    const selectedBeforeEmotionIds = Object.keys(this.selectedBeforeEmotions.getValue()).map(val => Number(val));
    const selectedBeforeFoodsIds = Object.keys(this.selectedBeforeFoods.getValue()).map(val => Number(val));

    return { selectedBeforeEmotionIds, selectedBeforeFoodsIds };
  }

  getSelectedAfterItemsIds() {
    const selectedAfterEmotionIds = Object.keys(this.selectedAfterEmotions.getValue()).map(val => Number(val));
    const selectedAfterFoodsIds = Object.keys(this.selectedAfterFoods.getValue()).map(val => Number(val));
    const selectedDistractionsIds = Object.keys(this.selectedDistractions.getValue()).map(val => Number(val));

    return { selectedAfterEmotionIds, selectedAfterFoodsIds, selectedDistractionsIds };
  }

  formatDataforInsert(data) {
    const cols = [], values = [];

    for (let prop in data) {
      cols.push(prop);
      values.push(data[prop]);
    }

    return { cols, values };
  }

  formatDataForUpdate(data) {
    const values = [];
    for (let col in data) {
      values.push({col, value: data[col]});
    }

    return values;
  }

}
