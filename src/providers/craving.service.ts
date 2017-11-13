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

  getCravingsForMonth(month: string | number, year: string | number) {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      //regex like expression --> finds by month and year, non day specific
      extraStatement: `WHERE cravingDate LIKE '${year}_${month}___'`
    });
  }

  getCravingsForDate(date: string) {
    return this.databaseService.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE cravingDate = '${date}'`
    });
  }

  addCraving(form: object) {
    return this.databaseService.insert({
      dbName: `${this.dbName}s`,
      item: form
    });
  }

  getCravingEmotions(cravingId: number) {
    return this.databaseService.select({
      dbName: `${this.dbName}Emotions`,
      selection: '*',
      extraStatement: `INNER JOIN emotions on emotions.id = ${this.dbName}Emotions.emotionId WHERE ${this.dbName}Emotions.cravingId = ${cravingId}`
    });
  }

  addCravingEmotion(cravingId: number, emotionId: number) {
    return this.databaseService.insert({
      dbName: `${this.dbName}Emotions`,
      item: { cravingId, emotionId }
    });
  }

  addCravingEmotions(cravingId: number, emotionIds: Array<number>) {
    if (emotionIds.length < 1) return Promise.resolve({ id: cravingId });

    const items = emotionIds.map(emotionId => ({ cravingId, emotionId }));
    return this.databaseService.bulkInsert({ dbName: `${this.dbName}Emotions`, items })
  }

  getCravingFoods(cravingId: number) {
    return this.databaseService.select({
      dbName: `${this.dbName}Foods`,
      selection: '*',
      extraStatement: `INNER JOIN foods on foods.id = ${this.dbName}Foods.foodId WHERE ${this.dbName}Foods.${this.dbName}Id = ${cravingId}`
    });
  }

  addCravingFood(cravingId: number, foodId: number) {
    return this.databaseService.insert({
      dbName: `${this.dbName}Foods`,
      item: { cravingId, foodId }
    });
  }

  addCravingFoods(cravingId: number, foodIds: Array<number>) {
    if (foodIds.length < 1) return Promise.resolve({ id: cravingId });

    const items = foodIds.map(foodId => ({ cravingId, foodId }));
    return this.databaseService.bulkInsert({ dbName: `${this.dbName}Foods`, items })
  }
}
