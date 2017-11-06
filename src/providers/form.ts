import { Injectable } from '@angular/core';
import { EmotionsProvider } from './emotion';
import { FoodsProvider } from './food';
import { DistractionsProvider } from './distraction';
import { MealsProvider } from './meals';
import { CravingsProvider } from './craving';

import { BehaviorSubject } from "rxjs";

import 'rxjs/add/operator/map';

/*
  To assist with the emotions/distractions modal communication
  And to submit form when complete
*/
@Injectable()
export class FormProvider {

  selectedBeforeEmotions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedBeforeFoods: BehaviorSubject<object> = new BehaviorSubject({});

  selectedDistractions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedAfterEmotions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedAfterFoods: BehaviorSubject<object> = new BehaviorSubject({});

  constructor(
      private emotionsProvider: EmotionsProvider,
      private foodsProvider: FoodsProvider,
      private distractionsProvider: DistractionsProvider,
      private mealsProvider: MealsProvider,
      private cravingsProvider: CravingsProvider,
    ) {
  }

  updateBeforeEmotions(emotions) {
    this.selectedBeforeEmotions.next({...emotions});
  }

  updateAfterEmotions(emotions) {
    this.selectedAfterEmotions.next({...emotions});
  }

  addNewEmotion(name) {
    return this.emotionsProvider.addEmotion(name)
    .then((data: any) => ({id : data.id, name}))
    .catch(console.error)
  }

  updateBeforeFoods(foods) {
    this.selectedBeforeFoods.next({...foods});
  }

  updateAfterFoods(foods) {
    this.selectedAfterFoods.next({...foods});
  }

  addNewFood(name) {
    return this.foodsProvider.addFood(name)
    .then((data: any) => ({id : data.id, name}))
    .catch(console.error)
  }

  updateDistractions(distractions) {
    this.selectedDistractions.next({...distractions});
  }

  addNewDistraction(name) {
    return this.distractionsProvider.addDistraction(name)
    .then((data: any) => ({id : data.id, name}))
    .catch(console.error)
  }

  submitBeforeMealForm(data) {
    const { cols, values } = this.formatDataforInsert(data);

    return this.mealsProvider.addMeal(cols, values)
    .then((data: any) => {
      return this.linkBeforeFormItemsWithMeal(data.id)
      .then((data: any) => {
        this.clearBeforeForm();
        return this.mealsProvider.getMeal(data.id);
      });
    });
  }

  linkBeforeFormItemsWithMeal(id) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();

    return this.mealsProvider.addMealEmotions(id, selectedBeforeEmotionIds, 'before')
    .then(() => this.mealsProvider.addMealFoods(id, selectedBeforeFoodsIds, 'before'))
    .then(() => ({id: id}));
  }

  submitCravingForm(data) {
    const { cols, values } = this.formatDataforInsert(data);

    return this.cravingsProvider.addCraving(cols, values)
    .then((data: any) => {
      this.linkCravingItemsWithCraving(data.id)
      .then(() => {
        this.clearBeforeForm();
        return this.cravingsProvider.getCraving(data.id);
      });
    });
  }

  linkCravingItemsWithCraving(id) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();

    return this.cravingsProvider.addCravingEmotions(id, selectedBeforeEmotionIds)
    .then(() => this.cravingsProvider.addCravingFoods(id, selectedBeforeFoodsIds))
    .then(() => ({id: id}));
  }

  linkAfterItemsWithMeal(id) {
    const { selectedAfterEmotionIds, selectedAfterFoodsIds, selectedDistractionsIds } = this.getSelectedAfterItemsIds();

    return this.mealsProvider.addMealEmotions(id, selectedAfterEmotionIds, 'after')
    .then(() => this.mealsProvider.addMealFoods(id, selectedAfterFoodsIds, 'after'))
    .then(() => this.mealsProvider.addMealDistractions(id, selectedDistractionsIds))
    .then(() => ({id: id}));
  }

  updateBeforeMealItems(id, previousEmotions, previousFoods) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();
    const previousEmotionsIds = Object.keys(previousEmotions).map(val => Number(val));
    const previousFoodsIds = Object.keys(previousFoods).map(val => Number(val));

    return this.mealsProvider.updateMealEmotions(id, 'before', previousEmotionsIds, selectedBeforeEmotionIds)
    .then(() => this.mealsProvider.updateMealFoods(id, 'before', previousFoodsIds, selectedBeforeFoodsIds))
    .then(() => ({id: id}));
  }

  submitNewAfterMealForm(data) {
    return this.submitBeforeMealForm(data)
    .then((data: any) => this.linkAfterItemsWithMeal(data.id))
    .then((data: any) => {
      this.clearAfterForm();
      return this.mealsProvider.getMeal(data.id);
    });
  }

  submitExistingMealAfterForm(mealId, data, beforeEmotions, beforeFoods ) {
    const mealData = this.formatDataForUpdate(data);

    return this.mealsProvider.updateMeal(mealId, mealData)
    .then(() => this.updateBeforeMealItems(mealId, beforeEmotions, beforeEmotions))
    .then(() => {
      this.clearAfterForm();
      return this.mealsProvider.getMeal(mealId)
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
