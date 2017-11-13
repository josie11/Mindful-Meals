import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import 'rxjs/add/operator/map';

/*
  Generated class for the CravingsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CravingsService {

  dbName: string = 'craving';

  constructor(private databaseService: DatabaseService) {
  }

 /**
   * Gets a craving by Id.
   * Gets all craving foods and emotions.
   * @param {cravingId} cravingId - the id of the craving to get
   *
   * @return {object} return craving object
 */
  getCraving(cravingId: number) {
    let craving;

    return this.databaseService.select({
      selection: '*',
      dbName: `${this.dbName}s`,
      extraStatement: `WHERE id = ${cravingId}`
    })
    .then((data: any) => {
      craving = data[0];
      return this.getCravingFoods(cravingId);
    })
    .then((data: any) => {
      craving['foods'] = data;
      return this.getCravingEmotions(cravingId);
    })
    .then((data: any) => {
      craving['emotions'] = data
      return craving;
    });
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
}
