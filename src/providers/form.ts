import { Injectable } from '@angular/core';
import { DatabaseProvider } from './database';
import { EmotionsProvider } from './emotion';
import { FoodsProvider } from './food';
import { DistractionsProvider } from './distraction';
import { MealsProvider } from './meals';

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

  constructor(private databaseProvider: DatabaseProvider, private emotionsProvider: EmotionsProvider, private foodsProvider: FoodsProvider, private distractionsProvider: DistractionsProvider, private mealsProvider: MealsProvider) {
  }

  updateEmotions(emotions, mealType) {
    this[`selected${mealType}Emotions`].next({...emotions});
  }

  addNewEmotion(name) {
    return this.emotionsProvider.addEmotion(name)
    .then((data: any) => ({id : data.id, name}))
    .catch(console.error)
  }

  updateFoods(foods, mealType) {
    this[`selected${mealType}Foods`].next({...foods});
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

  submitBeforeForm(cols, values) {
    this.mealsProvider.addBeforeMeal(cols, values);
    //get back new id, then do distractions, foods, emotions
  }

  clearBeforeForm() {
    this.selectedBeforeEmotions.next({});
    this.selectedBeforeFoods.next({});
  }

  clearAfterForm() {
    this.selectedBeforeEmotions.next({});
    this.selectedBeforeFoods.next({});
    this.selectedDistractions.next({});
  }

}
