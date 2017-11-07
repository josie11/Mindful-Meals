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

  addCraving(cols: Array<string>, values: Array<string>) {
    return this.databaseService.insert({
      dbName: `${this.dbName}s`,
      cols,
      values
    });
  }

  getCravingEmotions(cravingId: number) {
    return this.databaseService.select({
      dbName: `${this.dbName}Emotions`,
      selection: '*',
      extraStatement: `WHERE cravingId = ${cravingId}`
    });
  }

  addCravingEmotion(cravingId: number, emotionId: number) {
    return this.databaseService.insert({
      dbName: `${this.dbName}Emotions`,
      cols: ['cravingId', 'emotionId'],
      values: [cravingId, emotionId]
    });
  }

  addCravingEmotions(cravingId: number, emotionIds: Array<number>) {
    if (emotionIds.length < 1) return Promise.resolve({ id: cravingId });

    const items = emotionIds.map(emotionId => ({
      cols: ['cravingId', 'emotionId'],
      values: [cravingId, emotionId]
    }));
    return this.databaseService.bulkInsert({ dbName: `${this.dbName}Emotions`, items })
  }

  getCravingFoods(cravingId: number) {
    return this.databaseService.select({
      dbName: `${this.dbName}Foods`,
      selection: '*',
      extraStatement: `WHERE cravingId = ${cravingId}`
    });
  }

  addCravingFood(cravingId: number, foodId: number) {
    return this.databaseService.insert({
      dbName: `${this.dbName}Foods`,
      cols: ['cravingId', 'foodId'],
      values: [cravingId, foodId]
    });
  }

  addCravingFoods(cravingId: number, foodIds: Array<number>) {
    if (foodIds.length < 1) return Promise.resolve({ id: cravingId });

    const items = foodIds.map(foodId => ({
      cols: ['cravingId', 'foodId'],
      values: [cravingId, foodId]
    }));
    return this.databaseService.bulkInsert({ dbName: `${this.dbName}Foods`, items })
  }
}
