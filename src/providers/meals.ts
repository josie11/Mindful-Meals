import { Injectable } from '@angular/core';
import { DatabaseProvider } from './database';
import difference from 'lodash.difference';

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
      return this.getMealDetails(mealId);
    })
    .then(details => ({ ...meal, ...details }));
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

  addMeal(cols: Array<string>, values: Array<string>) {
    return this.databaseProvider.insert({
      dbName: `${this.dbName}s`,
      cols,
      values
    });
  }

  getMealDetails(mealId: number) {
    const meal: any = {};

    return this.getMealFoods(mealId)
    .then((data: any) => {
      const { after, before } = this.seperateBeforeAfterItems(data);
      meal.beforeFoods = before;
      meal.afterFoods = after;

      return this.getMealEmotions(mealId);
    })
    .then((data: any) => {
      const { after, before } = this.seperateBeforeAfterItems(data);
      meal.beforeEmotions = before;
      meal.afterEmotions = after;
      return this.getMealDistractions(mealId);
    })
    .then((data: any) => {
      meal.distractions = data;
      return meal;
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

  updateMeal(mealId: number, values: Array<object>) {
    if(values.length < 1) return Promise.resolve({id : mealId });

    return this.databaseProvider.update({
      dbName: `${this.dbName}s`,
      values,
      id: mealId
    });
  }

  addMealEmotions(mealId: number, emotionIds: Array<number>, mealStage: string) {
    if (emotionIds.length < 1) return Promise.resolve({id : mealId });

    const items = emotionIds.map(emotionId => ({
      cols: ['mealId', 'emotionId', 'mealStage'],
      values: [mealId, emotionId, mealStage]
    }));
    return this.databaseProvider.bulkInsert({ dbName: `${this.dbName}Emotions`, items })
  }

  updateMealEmotions(mealId: number, mealStage: string, beforeEmotions: Array<number>, afterEmotions: Array<number>) {
    const { addIds, deleteIds } = this.findChangesToMealItems(beforeEmotions, afterEmotions);

    return this.addMealEmotions(mealId, addIds, mealStage)
    .then(() => this.deleteMealEmotions(mealId, deleteIds, mealStage));
  }

  deleteMealEmotions(mealId: number, emotionIds: Array<number>, mealStage: string) {
    if (emotionIds.length < 1) return Promise.resolve({id : mealId });

    const extraStatements = emotionIds.map(emotionId => `WHERE emotionId = ${emotionId} AND mealId = ${mealId} AND mealStage = ${mealStage}`);

    return this.databaseProvider.bulkDelete({ dbName: `${this.dbName}Emotions`, extraStatements });
  }

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
    if (foodIds.length < 1) return Promise.resolve({id : mealId });

    const items = foodIds.map(foodId => ({
      cols: ['mealId', 'foodId', 'mealStage'],
      values: [mealId, foodId, mealStage]
    }));
    return this.databaseProvider.bulkInsert({ dbName: `${this.dbName}Foods`, items })
  }

  updateMealFoods(mealId: number, mealStage: string, beforeFoods: Array<number>, afterFoods: Array<number>) {
    const { addIds, deleteIds } = this.findChangesToMealItems(beforeFoods, afterFoods);

    return this.addMealFoods(mealId, addIds, mealStage)
    .then(() => this.deleteMealFoods(mealId, deleteIds, mealStage));
  }

  deleteMealFoods(mealId: number, foodIds: Array<number>, mealStage: string) {
    if (foodIds.length < 1) return Promise.resolve({id : mealId });

    const extraStatements = foodIds.map(foodId => `WHERE foodId = ${foodId} AND mealId = ${mealId} AND mealStage = ${mealStage}`);

    return this.databaseProvider.bulkDelete({ dbName: `${this.dbName}Foods`, extraStatements });
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
    if (distractionIds.length < 1) return Promise.resolve({id : mealId });

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

  // => returns { add: [], delete: [] }
  findChangesToMealItems(beforeIds: Array<number>, afterIds: Array<number>) {

    const deleteIds = difference(beforeIds, afterIds);
    const addIds = difference(afterIds, beforeIds);

    return { addIds, deleteIds };
  }

  seperateBeforeAfterItems(items: Array<object>) {
    const before = [];
    const after = [];

    items.forEach((item: any) => {
      if (item.mealStage === 'before') before.push(item)
      else if (item.mealStage === 'after') after.push(item);
    });

    return { after, before };
  }
}
