import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Subject } from "rxjs";
import 'rxjs/add/operator/map';
import { CompleteMealForm, BeforeMealForm, Meal } from '../common/types';
import { findChangesToItems, formatItemsArrayToObject } from '../common/utils';
/*
  Generated class for the MealsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MealsService {

  dbName: string = 'meal';

  //fired when we create a new meal --> to trigger update in segments
  mealAdded: Subject<Meal> = new Subject();

  //fired when we update a meal --> to trigger update in segments
  mealUpdated: Subject<Meal> = new Subject();

  //fired when we dete a meal --> to trigger update in segments
  mealDeleted: Subject<object> = new Subject();

  constructor(private databaseService: DatabaseService) {
  }

  /**
   * Gets a meal by Id.
   * Gets all meal foods, emotions, distractions.
   * @param {mealId} mealId - the id of the meal to get
   *
   * @return {object} return meal object
 */
  getMeal(mealId: number): Promise<Meal> {
    return this.databaseService.select({
      selection: '*',
      dbName: `${this.dbName}s`,
      extraStatement: `WHERE id = ${mealId}`
    })
    .then((data: any) => {
      const meal = data[0];
      return this.returnMealWithItems(meal);
    });
  }

  /**
   * Returns an Array of all meals for a given date.
   * @param {date} date string to get meals for.
   *
   * @return {array} returns array of meal objects
  */
  getMealsForDate(date: string) {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE mealDate = '${date}'`
    });
  }

  /**
   * Returns an Array of all meals for a given month/year.
   * @param {month} month to get meals for - can be string or number because
     single digits have to be formatted for SQL to be a proper date string; 9 --> '09'
   *
   * @param {year} year of meal month.
   *
   * @return {array} returns array of meal objects
  */
  getMealsForMonth(month: string | number, year: string | number): Promise<Partial<Meal>[]> {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      //regex like expression --> finds by month and year, non day specific
      extraStatement: `WHERE mealDate LIKE '${year}_${month}___'`
    });
  }

  /**
   * Returns the previous CLOSEST meal in date/time.
   * @param {mealId} id of meal current meal. Need so can exclude it from possible results.
   *
   * @param {date} day, year, month of current meal.
   *
   * @param {time} time of day of current meal.
   *
   * @return {(object|undefined)} returns a meal object if exists in database, or undefined. There may be no previous date.
  */
  getPreviousMeal(mealId: number, date: string, time: string): Promise<Meal> {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE id != ${mealId}
        AND (date(mealDate) <= date('${date}') AND time(mealTime) <= time('${time}'))
        OR date(mealDate) < date('${date}')
        ORDER BY date(mealDate) DESC, time(mealTime) DESC LIMIT 1`
    })
    .then((data: any) => {
      const meal = data[0];

      if (!meal) return;

      return this.returnMealWithItems(meal);
    });
  }

  /**
   * Returns the next CLOSEST meal in date/time.
   * @param {mealId} id of meal current meal. Need so can exclude it from possible results.
   *
   * @param {date} day, year, month of current meal.
   *
   * @param {time} time of day of current meal.
   *
   * @return {(object|undefined)} returns a meal object if exists in database, or undefined. There may be no next date.
  */
  getNextMeal(mealId: number, date: string, time: string): Promise<Meal> {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE id != ${mealId}
      AND (date(mealDate) >= date('${date}') AND time(mealTime) >= time('${time}'))
      OR date(mealDate) > date('${date}')
      ORDER BY date(mealDate) ASC, time(mealTime) ASC LIMIT 1`
    })
    .then((data: any) => {
      const meal = data[0];

      if (!meal) return;

      return this.returnMealWithItems(meal);
    });
  }

  /**
   * Returns all meals that have not had after meal details added.
   *
   * @return {array} returns array of meal objects.
  */
  getIncompleteMeals(): Promise<Partial<Meal>[]> {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE completed = 0`
    });
  }

  /**
   * Takes a meal, gets its associated emotions/foods/distractions, returns meal with items attached.
   * @param {meal} meal to get and attach items to.
   *
   * @return {object} returns meal object.
  */
  returnMealWithItems(meal): Promise<Meal> {
    const items: any = {};

    return this.getMealFoods(meal.id)
    .then((data: any) => {
      const { after, before } = this.seperateBeforeAfterItems(data);
      items.beforeFoods = before;
      items.afterFoods = after;

      return this.getMealEmotions(meal.id);
    })
    .then((data: any) => {
      const { after, before } = this.seperateBeforeAfterItems(data);
      items.beforeEmotions = before;
      items.afterEmotions = after;
      return this.getMealDistractions(meal.id);
    })
    .then((data: any) => {
      items.distractions = data;
      return {...items, ...meal};
    });
  }

  /**
   * Will add a new meal to the database.
   * @param {form} form object with details about new meal - passed from form service.
   *
   * @return {object} returns meal object.
  */
  addMeal(form: CompleteMealForm | BeforeMealForm) {
    return this.databaseService.insert({
      dbName: `${this.dbName}s`,
      item: form
    });
  }

  /**
   * Updates a meal.
   * @param {mealId} Id of meal.
   *
   * @param {values} values to update meal, from form services. Object where key represents the column and value is update.
  */
  updateMeal(mealId: number, values: Partial<CompleteMealForm>) {
    return this.databaseService.update({
      dbName: `${this.dbName}s`,
      values,
      id: mealId
    });
  }

  /**
   * Deletes a meal
   *
   * @param {mealId} Id of meal.
   *
  */
  deleteMeal(mealId: number) {
    return this.databaseService.delete({
      dbName: `${this.dbName}s`,
      extraStatement: `WHERE id = ${mealId}`,
    });
  }

  /**
   * Get array emotions associated with a given meal
   * @param {mealId} id of meal.
   *
   * @param {mealStage} stage of meal to get emotions for, before - or after meal.
   *
   * @return {array} returns array of meal emotions.
  */
  getMealEmotions(mealId: number, mealStage: string = '') {
    const parameters = {
      dbName: `${this.dbName}Emotions`,
      selection: '*',
      extraStatement: `INNER JOIN emotions on emotions.id = ${this.dbName}Emotions.emotionId WHERE ${this.dbName}Emotions.mealId = ${mealId}`
    };

    if (mealStage) parameters.extraStatement += ` AND mealStage = '${mealStage}'`;

    return this.databaseService.select(parameters);
  }

  /**
   * Associate single emotion with meal.
   * @param {mealId} Id of meal.
   *
   * @param {emotionId} Id of emotion.
  */
  addMealEmotion(mealId: number, emotionId: number, mealStage: string) {
    return this.databaseService.insert({
      dbName: `${this.dbName}Emotions`,
      item: { mealId, emotionId, mealStage }
    });
  }

  /**
   * Associates multiple emotions with a meal.
   * @param {mealId} Id of meal.
   *
   * @param {emotionIds} and array of emotion Ids.
   *
   * @param {mealStage} stage of meal to add emotions for.
  */
  addMealEmotions(mealId: number, emotionIds: Array<number>, mealStage: string) {
    if (emotionIds.length < 1) return Promise.resolve({ id : mealId });

    const items = emotionIds.map(emotionId => ({ mealId, emotionId, mealStage }));
    return this.databaseService.bulkInsert({ dbName: `${this.dbName}Emotions`, items })
    .then(() => ({ id : mealId }));
  }

  /**
   * Updates emotions associated with meal.
   * @param {mealId} Id of meal.
   *
   * @param {mealStage} stage of meal to update for.
   *
   * @param {beforeEmotions} Array of emotion ids that are already associated with meal.
   *
   * @param {afterEmotions} Array of emotion ids that will be associated with meal.
  */
  updateMealEmotions(mealId: number, mealStage: string, beforeEmotions: Array<number>, afterEmotions: Array<number>) {
    const { addIds, deleteIds } = this.findChangesToMealItems(beforeEmotions, afterEmotions);

    return this.addMealEmotions(mealId, addIds, mealStage)
    .then(() => this.deleteMealEmotions(mealId, deleteIds, mealStage));
  }

  /**
   * Deletes emotions associated with meal.
   * @param {mealId} Id of meal.
   *
   * @param {mealStage} stage of meal to update for.
   *
   * @param {emotionIds} Array of emotion ids that are associated with meal.
  */
  deleteMealEmotions(mealId: number, emotionIds: Array<number>, mealStage: string) {
    if (emotionIds.length < 1) return Promise.resolve({id : mealId });

    const extraStatements = emotionIds.map(emotionId => `WHERE emotionId = ${emotionId} AND mealId = ${mealId} AND mealStage = '${mealStage}'`);

    return this.databaseService.bulkDelete({ dbName: `${this.dbName}Emotions`, extraStatements });
  }

  /**
   * Get array foods associated with a given meal
   * @param {mealId} id of meal.
   *
   * @param {mealStage} stage of meal to get foods for, before - or after meal.
   *
   * @return {array} returns array of meal foods.
  */
  getMealFoods(mealId: number, mealStage: string = '') {
    const parameters = {
      dbName: `${this.dbName}Foods`,
      selection: '*',
      extraStatement: `INNER JOIN foods on foods.id = ${this.dbName}Foods.foodId WHERE ${this.dbName}Foods.mealId = ${mealId}`
    };

    if (mealStage) parameters.extraStatement += ` AND mealStage = '${mealStage}'`;

    return this.databaseService.select(parameters);
  }

  /**
   * Associate single food with meal.
   * @param {mealId} Id of meal.
   *
   * @param {foodId} Id of food.
  */
  addMealFood(mealId: number, foodId: number, mealStage: string) {
    return this.databaseService.insert({
      dbName: `${this.dbName}Foods`,
      item: { mealId, foodId, mealStage }
    });
  }

  /**
   * Associates multiple foods with a meal.
   * @param {mealId} Id of meal.
   *
   * @param {foodIds} and array of food Ids.
   *
   * @param {mealStage} stage of meal to add foods for.
  */
  addMealFoods(mealId: number, foodIds: Array<number>, mealStage: string) {
    if (foodIds.length < 1) return Promise.resolve({id : mealId });

    const items = foodIds.map(foodId => ({ mealId, foodId, mealStage }));
    return this.databaseService.bulkInsert({ dbName: `${this.dbName}Foods`, items })
  }

  /**
   * Updates foods associated with meal.
   * @param {mealId} Id of meal.
   *
   * @param {mealStage} stage of meal to update for.
   *
   * @param {beforeFoods} Array of food ids that are already associated with meal.
   *
   * @param {afterFoods} Array of food ids that will be associated with meal.
  */
  updateMealFoods(mealId: number, mealStage: string, beforeFoods: Array<number>, afterFoods: Array<number>) {
    const { addIds, deleteIds } = this.findChangesToMealItems(beforeFoods, afterFoods);

    return this.addMealFoods(mealId, addIds, mealStage)
    .then(() => this.deleteMealFoods(mealId, deleteIds, mealStage));
  }

  /**
   * Deletes foods associated with meal.
   * @param {mealId} Id of meal.
   *
   * @param {mealStage} stage of meal to update for.
   *
   * @param {foodIds} Array of food ids that are associated with meal.
  */
  deleteMealFoods(mealId: number, foodIds: Array<number>, mealStage: string) {
    if (foodIds.length < 1) return Promise.resolve({id : mealId });

    const extraStatements = foodIds.map(foodId => `WHERE foodId = ${foodId} AND mealId = ${mealId} AND mealStage = '${mealStage}'`);

    return this.databaseService.bulkDelete({ dbName: `${this.dbName}Foods`, extraStatements });
  }

  /**
   * Get array distractions associated with a given meal
   * @param {mealId} id of meal.
   *
   * @return {array} returns array of meal distractions.
  */
  getMealDistractions(mealId: number) {
    const parameters = {
      dbName: `${this.dbName}Distractions`,
      selection: '*',
      extraStatement: `INNER JOIN distractions on distractions.id = ${this.dbName}Distractions.distractionId WHERE ${this.dbName}Distractions.mealId = ${mealId}`
    };

    return this.databaseService.select(parameters);
  }

  /**
   * Associate single distraction with meal.
   * @param {mealId} Id of meal.
   *
   * @param {distractionId} Id of distraction.
  */
  addMealDistraction(mealId: number, distractionId: number) {
    return this.databaseService.insert({
      dbName: `${this.dbName}Distractions`,
      item: { mealId, distractionId }
    });
  }

  /**
   * Associates multiple distractions with a meal.
   * @param {mealId} Id of meal.
   *
   * @param {distractionIds} and array of distraction Ids.
  */
  addMealDistractions(mealId: number, distractionIds: Array<number>) {
    if (distractionIds.length < 1) return Promise.resolve({id : mealId });

    const items = distractionIds.map(distractionId => ({ mealId, distractionId }));
    return this.databaseService.bulkInsert({ dbName: `${this.dbName}Distractions`, items })
  }

  /**
   * Updates distractions associated with meal.
   * @param {mealId} Id of meal.
   *
   * @param {beforeDistractions} Array of distraction ids that are already associated with meal.
   *
   * @param {afterDistractions} Array of distraction ids that will be associated with meal.
  */
  updateMealDistractions(mealId: number, beforeDistractions: Array<number>, afterDistractions: Array<number>) {
    const { addIds, deleteIds } = this.findChangesToMealItems(beforeDistractions, afterDistractions);

    return this.addMealDistractions(mealId, addIds)
    .then(() => this.deleteMealDistractions(mealId, deleteIds));
  }

  /**
   * Deletes distractions associated with meal.
   * @param {mealId} Id of meal.
   *
   * @param {distractionIds} Array of distraction ids that are associated with meal.
  */
  deleteMealDistractions(mealId: number, distractionIds: Array<number>) {
    if (distractionIds.length < 1) return Promise.resolve({id : mealId });

    const extraStatements = distractionIds.map(distractionId => `WHERE distractionId = ${distractionId} AND mealId = ${mealId}`);

    return this.databaseService.bulkDelete({ dbName: `${this.dbName}Distractions`, extraStatements });
  }

  /**
   * Formats meal items to an object where keys are ids and value are item name.
   * For use in components like checkbox list and forms.
   * @param {items} array of meal item objects.
   *
   * @return {object} returns formatted object --> { itemId: itemName, ... }
  */
  formatMealItemsToCheckboxObject(items: Array<object>) {
    return formatItemsArrayToObject(items);
  }

  /**
   * will compare two arrays of ids, and find which ids should be added/deleted
   * based on what ids are in arrays.
   * @param {beforeIds} array of item ids associated with meal.
   *
   * @param {afterIds} array of item ids to be associated with meal.
   *
   * @return {object} returns object with array on add property and delete property --> { add: [], delete: [] }
  */
  findChangesToMealItems(beforeIds: Array<number>, afterIds: Array<number>) {
    return findChangesToItems(beforeIds, afterIds);
  }

  /**
   * A meal can have before/after emotions/foods. These item in join table have
   * column called mealStage with 'before' or 'after' value. This will sort array
   * of emotions/foods items and categorize them by stage.
   * @param {items} array of item ids associated with meal.
   *
   * @return {object} returns object with array of items on after property and before property --> { after: [{item}, {item}], before: [{item}, {item}] }
  */
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
