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

  dbName: string = 'meal';

  constructor(private databaseProvider: DatabaseProvider) {
  }

  getMeal(mealId: number) {
    let meal;

    return this.databaseProvider.select({
      selection: '*',
      dbName: `${this.dbName}s`,
      extraStatement: `WHERE id = ${mealId}`
    })
    .then((data: any) => {
      meal = data[0];
      return this.getMealFoods(mealId);
    })
    .then((data: any) => {
      meal['foods'] = data;
      return this.getMealEmotions(mealId);
    })
    .then((data: any) => {
      meal['emotions'] = data
      return this.getMealDistractions(mealId);
    })
    .then((data: any) => {
      meal['distractions'] = data;
      return meal;
    });
  }

  getMealsForDate(date: string) {
    return this.databaseProvider.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE mealDate = ${date}`
    });
  }

  getIncompleteMeals() {
    return this.databaseProvider.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE completed = 0`
    });
  }

  addBeforeMeal(cols: Array<string>, values: Array<string>) {
    return this.databaseProvider.insert({
      dbName: `${this.dbName}s`,
      cols,
      values
    });
  }

  getMealEmotions(mealId: number, mealStage: string = '') {
    const parameters = {
      dbName: `${this.dbName}Emotions`,
      selection: '*',
      extraStatement: `INNER JOIN emotions on emotions.id = ${this.dbName}Emotions.emotionId WHERE ${this.dbName}Emotions.mealId = ${mealId}`
    };

    if (mealStage) parameters.extraStatement += ` AND mealStage = '${mealStage}'`;

    return this.databaseProvider.select(parameters);
  }

  addMealEmotion(mealId: number, emotionId: number, mealStage: string) {
    return this.databaseProvider.insert({
      dbName: `${this.dbName}Emotions`,
      cols: ['mealId', 'emotionId', 'mealStage'],
      values: [mealId, emotionId, mealStage]
    });
  }

  addMealEmotions(mealId: number, emotionIds: Array<number>, mealStage: string) {
    const items = emotionIds.map(emotionId => ({
      cols: ['mealId', 'emotionId', 'mealStage'],
      values: [mealId, emotionId, mealStage]
    }));
    return this.databaseProvider.bulkInsert({ dbName: `${this.dbName}Emotions`, items })
  }
// `WHERE mealId = ${mealId}`
  getMealFoods(mealId: number, mealStage: string = '') {
    const parameters = {
      dbName: `${this.dbName}Foods`,
      selection: '*',
      extraStatement: `INNER JOIN foods on foods.id = ${this.dbName}Foods.foodId WHERE ${this.dbName}Foods.mealId = ${mealId}`
    };

    if (mealStage) parameters.extraStatement += ` AND mealStage = '${mealStage}'`;

    return this.databaseProvider.select(parameters);
  }

  addMealFood(mealId: number, foodId: number, mealStage: string) {
    return this.databaseProvider.insert({
      dbName: `${this.dbName}Foods`,
      cols: ['mealId', 'foodId', 'mealStage'],
      values: [mealId, foodId, mealStage]
    });
  }

  addMealFoods(mealId: number, foodIds: Array<number>, mealStage: string) {
    const items = foodIds.map(foodId => ({
      cols: ['mealId', 'foodId', 'mealStage'],
      values: [mealId, foodId, mealStage]
    }));
    return this.databaseProvider.bulkInsert({ dbName: `${this.dbName}Foods`, items })
  }

  getMealDistractions(mealId: number) {
    const parameters = {
      dbName: `${this.dbName}Distractions`,
      selection: '*',
      extraStatement: `INNER JOIN distractions on distractions.id = ${this.dbName}Distractions.distractionId WHERE ${this.dbName}Distractions.mealId = ${mealId}`
    };

    return this.databaseProvider.select(parameters);
  }

  addMealDistraction(mealId: number, distractionId: number) {
    return this.databaseProvider.insert({
      dbName: `${this.dbName}Distractions`,
      cols: ['mealId', 'distractionId'],
      values: [mealId, distractionId]
    });
  }

  addMealDistractions(mealId: number, distractionIds: Array<number>) {
    const items = distractionIds.map(distractionId => ({
      cols: ['mealId', 'distractionId'],
      values: [mealId, distractionId]
    }));
    return this.databaseProvider.bulkInsert({ dbName: `${this.dbName}Distractions`, items })
  }

  formatMealItemsToCheckboxObject(items: Array<object>) {
    return items.reduce((obj, item: any) => {
      obj[item.id] = item.name;
      return obj;
    }, {});
  }
}
