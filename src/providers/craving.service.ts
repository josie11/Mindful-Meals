import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { SharedService } from './shared.service';

import 'rxjs/add/operator/map';

/*
  Generated class for the CravingsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CravingsService {

  dbName: string = 'craving';

  constructor(private databaseService: DatabaseService, private sharedService: SharedService) {
  }

 /**
   * Gets a craving by Id.
   * Gets all craving foods and emotions.
   * @param {cravingId} cravingId - the id of the craving.
   *
   * @return {object} return craving object.
 */
  getCraving(cravingId: number) {
    return this.databaseService.select({
      selection: '*',
      dbName: `${this.dbName}s`,
      extraStatement: `WHERE id = ${cravingId}`
    })
    .then((data: any) => {
      const craving = data[0];
      return this.returnCravingWithItems(craving);
    })
  }

  /**
   * Returns an Array of all cravings for a given month/year.
   * @param {month} month to get cravings for - can be string or number because
     single digits have to be formatted for SQL to be a proper date string; 9 --> '09'
   *
   * @param {year} year of craving month.
   *
   * @return {array} returns array of craving objects
 */
  getCravingsForMonth(month: string | number, year: number) {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      //regex like expression --> finds by month and year, non day specific
      extraStatement: `WHERE cravingDate LIKE '${year}_${month}___'`
    });
  }

  /**
   * Returns an Array of all cravings for a given date.
   * @param {date} date string to get cravings for.
   *
   * @return {array} returns array of craving object
  */
  getCravingsForDate(date: string) {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE cravingDate = '${date}'`
    });
  }

  /**
   * Returns the previous CLOSEST craving in date/time.
   * @param {cravingId} id of craving current craving. Need so can exclude it from possible results.
   *
   * @param {date} day, year, month of current craving.
   *
   * @param {time} time of day of current craving.
   *
   * @return {(object|undefined)} returns a craving object if exists in database, or undefined. There may be no previous date.
  */
  //BUG: if by chance 2 submissions on same day have exact same time, will loop back and forth between the entries with same date/time indefinitely. I added seconds to time storing to reduce possiblity of this happening, and seems unlikely user will create this circumstance.
  getPreviousCraving(cravingId: number, date: string, time: string) {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE id != ${cravingId}
        AND (date(cravingDate) <= date('${date}') AND time(cravingTime) <= time('${time}'))
        OR date(cravingDate) < date('${date}')
        ORDER BY date(cravingDate) DESC, time(cravingTime) DESC LIMIT 1`
    })
    .then((data: any) => {
      const craving = data[0];

      if (!craving) return;

      return this.returnCravingWithItems(craving);
    });
  }

  /**
   * Returns the next CLOSEST craving in date/time.
   * @param {cravingId} id of craving current craving. Need so can exclude it from possible results.
   *
   * @param {date} day, year, month of current craving.
   *
   * @param {time} time of day of current craving.
   *
   * @return {(object|undefined)} returns a craving object if exists in database, or undefined. There may be no next date.
  */
  //BUG: if by chance 2 submissions on same day have exact same time, will loop through back and forth between these entries with same date/time indefinitely. I added seconds to time storing to reduce possiblity of this happening, and seems unlikely user will create this circumstance.
  getNextCraving(cravingId: number, date: string, time: string) {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE id != ${cravingId}
      AND (date(cravingDate) >= date('${date}') AND time(cravingTime) >= time('${time}'))
      OR date(cravingDate) > date('${date}')
      ORDER BY date(cravingDate) ASC, time(cravingTime) ASC LIMIT 1`
    })
    .then((data: any) => {
      const craving = data[0];

      if (!craving) return;

      return this.returnCravingWithItems(craving);
    });
  }

  /**
   * Takes a craving, gets its associated emotions/foods/distractions, returns craving with items attached.
   * @param {craving} craving to get and attach items to.
   *
   * @return {object} returns craving object.
  */
  returnCravingWithItems(craving: any) {
    const items: any = {};

    return this.getCravingFoods(craving.id)
    .then((data: any) => {
      items.foods = data;
      return this.getCravingEmotions(craving.id);
    })
    .then((data: any) => {
      items.emotions = data;
      return {...craving, ...items};
    });
  }

  /**
   * Will add a new craving to the database.
   * @param {form} form object with details about new craving - passed from form service.
   *
   * @return {object} return craving object
 */
  addCraving(form: object) {
    return this.databaseService.insert({
      dbName: `${this.dbName}s`,
      item: form
    });
  }

  /**
   * Updates existing craving. Pass an object with keys representing column names
   * and values representing what new values will be
   *
   * @param {cravingId} Id of craving.
   *
   * @param {values} form object to update craving with.
  */
  updateCraving(cravingId: number, values: object) {
    return this.databaseService.update({
      dbName: `${this.dbName}s`,
      values,
      id: cravingId
    });
  }

  /**
   * Get array emotions associated with a given craving
   * @param {cravingId} id of craving.
   *
   * @return {array} returns array of craving objects
  */
  getCravingEmotions(cravingId: number) {
    return this.databaseService.select({
      dbName: `${this.dbName}Emotions`,
      selection: '*',
      extraStatement: `INNER JOIN emotions on emotions.id = ${this.dbName}Emotions.emotionId WHERE ${this.dbName}Emotions.cravingId = ${cravingId}`
    });
  }

  /**
   * Associate single emotion with craving.
   * @param {cravingId} Id of craving.
   *
   * @param {emotionId} Id of emotion.
  */
  addCravingEmotion(cravingId: number, emotionId: number) {
    return this.databaseService.insert({
      dbName: `${this.dbName}Emotions`,
      item: { cravingId, emotionId }
    });
  }

  /**
   * Associates multiple emotions with a craving.
   * @param {cravingId} Id of craving.
   *
   * @param {emotionIds} and array of emotion Ids.
  */
  addCravingEmotions(cravingId: number, emotionIds: Array<number>) {
    if (emotionIds.length < 1) return Promise.resolve({ id: cravingId });

    const items = emotionIds.map(emotionId => ({ cravingId, emotionId }));
    return this.databaseService.bulkInsert({ dbName: `${this.dbName}Emotions`, items })
  }

  /**
   * Updates emotions associated with craving.
   * @param {cravingId} Id of craving.
   *
   * @param {beforeEmotions} Array of emotion ids that are already associated with craving.
   *
   * @param {afterEmotions} Array of emotion ids that will be associated with craving.
  */
  updateCravingEmotions(cravingId: number, beforeEmotions: Array<number>, afterEmotions: Array<number>) {
    const { addIds, deleteIds } = this.findChangesToCravingItems(beforeEmotions, afterEmotions);

    return this.addCravingEmotions(cravingId, addIds)
    .then(() => this.deleteCravingEmotions(cravingId, deleteIds));
  }

  /**
   * Deletes emotions associated with craving.
   * @param {cravingId} Id of craving.
   *
   * @param {emotionIds} Array of emotion ids that are associated with craving.
  */
  deleteCravingEmotions(cravingId: number, emotionIds: Array<number>) {
    if (emotionIds.length < 1) return Promise.resolve({id : cravingId });

    const extraStatements = emotionIds.map(emotionId => `WHERE emotionId = ${emotionId} AND cravingId = ${cravingId}`);

    return this.databaseService.bulkDelete({ dbName: `${this.dbName}Emotions`, extraStatements });
  }

  /**
   * Get array of foods associated with a given craving
   * @param {cravingId} id of craving.
   *
   * @return {array} returns array of craving object
  */
  getCravingFoods(cravingId: number) {
    return this.databaseService.select({
      dbName: `${this.dbName}Foods`,
      selection: '*',
      extraStatement: `INNER JOIN foods on foods.id = ${this.dbName}Foods.foodId WHERE ${this.dbName}Foods.${this.dbName}Id = ${cravingId}`
    });
  }

  /**
   * Associate single emotion with craving.
   * @param {cravingId} Id of craving.
   *
   * @param {foodId} Id of food.
  */
  addCravingFood(cravingId: number, foodId: number) {
    return this.databaseService.insert({
      dbName: `${this.dbName}Foods`,
      item: { cravingId, foodId }
    });
  }

  /**
   * Associates multiple foods with a craving.
   * @param {cravingId} Id of craving.
   *
   * @param {foodIds} and array of food Ids.
  */
  addCravingFoods(cravingId: number, foodIds: Array<number>) {
    if (foodIds.length < 1) return Promise.resolve({ id: cravingId });

    const items = foodIds.map(foodId => ({ cravingId, foodId }));
    return this.databaseService.bulkInsert({ dbName: `${this.dbName}Foods`, items })
  }

  /**
   * Updates foods associated with craving.
   * @param {cravingId} Id of craving.
   *
   * @param {beforeFoods} Array of food ids that are already associated with craving.
   *
   * @param {afterFoods} Array of food ids that will be associated with craving.
  */
  updateCravingFoods(cravingId: number, beforeFoods: Array<number>, afterFoods: Array<number>) {
    const { addIds, deleteIds } = this.findChangesToCravingItems(beforeFoods, afterFoods);

    return this.addCravingFoods(cravingId, addIds)
    .then(() => this.deleteCravingFoods(cravingId, deleteIds));
  }

  /**
   * Deletes foods associated with craving.
   * @param {cravingId} Id of craving.
   *
   * @param {foodIds} Array of food ids that are associated with craving.
  */
  deleteCravingFoods(cravingId: number, foodIds: Array<number>) {
    if (foodIds.length < 1) return Promise.resolve({id : cravingId });

    const extraStatements = foodIds.map(foodId => `WHERE foodId = ${foodId} AND cravingId = ${cravingId}`);

    return this.databaseService.bulkDelete({ dbName: `${this.dbName}Foods`, extraStatements });
  }

  /**
   * Formats craving items to an object where keys are ids and value are item name.
   * For use in components like checkbox list and forms.
   * @param {items} array of craving item objects.
   *
   * @return {object} returns formatted object --> { itemId: itemName, ... }
  */
  formatCravingItemsToCheckboxObject(items: Array<object>) {
    return this.sharedService.formatItemsArrayToObject(items);
  }

  /**
   * will compare two arrays of ids, and find which ids should be added/deleted
   * based on what ids are in arrays.
   * @param {beforeIds} array of item ids associated with craving.
   *
   * @param {afterIds} array of item ids to be associated with craving.
   *
   * @return {object} returns object with array on add property and delete property --> { add: [], delete: [] }
  */
  findChangesToCravingItems(beforeIds: Array<number>, afterIds: Array<number>) {
    return this.sharedService.findChangesToItems(beforeIds, afterIds);
  }

}
