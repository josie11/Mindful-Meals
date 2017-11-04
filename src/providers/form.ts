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
    const cols = [], values = [];

    for (let prop in data) {
      cols.push(prop);
      values.push(data[prop]);
    }

    return this.mealsProvider.addBeforeMeal(cols, values)
    .then((data: any) => {
      this.linkBeforeFormItemsWithMeal(data.id)
      .then(() => this.mealsProvider.getMeal(data.id));
    });
  }

  linkBeforeFormItemsWithMeal(id) {
    const selectedBeforeEmotionIds = Object.keys(this.selectedBeforeEmotions.getValue()).map(val => Number(val));
    const selectedBeforeFoodsIds = Object.keys(this.selectedBeforeFoods.getValue()).map(val => Number(val));

    const promiseChain = selectedBeforeEmotionIds.length > 0 ? this.mealsProvider.addMealEmotions(id, selectedBeforeEmotionIds, 'before') : Promise.resolve();

    return promiseChain.then(() => {
      if (selectedBeforeFoodsIds.length > 0) return this.mealsProvider.addMealFoods(id, selectedBeforeFoodsIds, 'before');
      return id;
    });
  }

  submitCravingForm(data) {
    const cols = [], values = [];

    for (let prop in data) {
      cols.push(prop);
      values.push(data[prop]);
    }

    return this.cravingsProvider.addCraving(cols, values)
    .then((data: any) => {
      this.linkCravingItemsWithCraving(data.id)
      .then(() => this.cravingsProvider.getCraving(data.id));
    });
  }

  linkCravingItemsWithCraving(id) {
    const selectedBeforeEmotionIds = Object.keys(this.selectedBeforeEmotions.getValue()).map(val => Number(val));
    const selectedBeforeFoodsIds = Object.keys(this.selectedBeforeFoods.getValue()).map(val => Number(val));

    const promiseChain = selectedBeforeEmotionIds.length > 0 ? this.cravingsProvider.addCravingEmotions(id, selectedBeforeEmotionIds) : Promise.resolve();

    return promiseChain.then(() => {
      if (selectedBeforeFoodsIds.length > 0) return this.cravingsProvider.addCravingFoods(id, selectedBeforeFoodsIds);
      return id;
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

}
