import { Injectable } from '@angular/core';
import { DatabaseProvider } from './database';
import 'rxjs/add/operator/map';

/*
  Generated class for the MealsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MealsProvider {

  constructor(private databaseProvider: DatabaseProvider) {
  }

  getTodaysMeals(date) {
    return this.databaseProvider.select({ dbName: 'meals', selection: '*', whereStatement: `WHERE mealDate = ${date}`});
  }

  addBeforeMeal(cols: Array<string>, values: Array<string>) {
    return this.databaseProvider.insert({
      dbName: 'meals',
      cols,
      values
    })
    .catch(console.error)
  }

  addAfterMeal(id, columns, values) {

  }

  updateMeal() {

  }

  addMealEmotion(mealId: number, emotionId: number, mealStage: string) {
    return this.databaseProvider.insert({
      dbName: 'mealEmotions',
      cols: ['mealId', 'emotionId', 'mealStage'],
      values: [mealId, emotionId, mealStage]
    })
    .catch(console.error)
  }

  addMealEmotions(mealId: number, emotionIds: Array<number>, mealStage: string) {
    const items = emotionIds.map(emotionId => ({
      cols: ['mealId', 'emotionId', 'mealStage'],
      values: [mealId, emotionId, mealStage]
    }));
    return this.databaseProvider.bulkInsert({ dbName: 'mealEmotions', items })
  }

  addMealFood(mealId: number, foodId: number, mealStage: string) {
    return this.databaseProvider.insert({
      dbName: 'mealFoods',
      cols: ['mealId', 'foodId', 'mealStage'],
      values: [mealId, foodId, mealStage]
    })
    .catch(console.error)
  }

  addMealFoods(mealId: number, foodIds: Array<number>, mealStage: string) {
    const items = foodIds.map(foodId => ({
      cols: ['mealId', 'foodId', 'mealStage'],
      values: [mealId, foodId, mealStage]
    }));
    return this.databaseProvider.bulkInsert({ dbName: 'mealFoods', items })
  }

  addMealDistraction(mealId: number, distractionId: number) {
    return this.databaseProvider.insert({
      dbName: 'mealDistractions',
      cols: ['mealId', 'distractionId'],
      values: [mealId, distractionId]
    })
    .catch(console.error)
  }

  addMealDistractions(mealId: number, distractionIds: Array<number>) {
    const items = distractionIds.map(distractionId => ({
      cols: ['mealId', 'distractionId'],
      values: [mealId, distractionId]
    }));
    return this.databaseProvider.bulkInsert({ dbName: 'mealDistractions', items })
  }
}
