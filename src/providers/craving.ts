import { Injectable } from '@angular/core';
import { DatabaseProvider } from './database';
import 'rxjs/add/operator/map';

/*
  Generated class for the CravingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CravingsProvider {

  dbName: string = 'craving';

  constructor(private databaseProvider: DatabaseProvider) {
  }

  getCraving(cravingId: number) {
    let craving;

    return this.databaseProvider.select({
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

  getCravingsForDate(date: string) {
    return this.databaseProvider.select({
      dbName: `${this.dbName}s`,
      selection: '*',
      extraStatement: `WHERE cravingDate = ${date}`
    });
  }

  addCraving(cols: Array<string>, values: Array<string>) {
    return this.databaseProvider.insert({
      dbName: `${this.dbName}s`,
      cols,
      values
    });
  }

  getCravingEmotions(cravingId: number) {
    return this.databaseProvider.select({
      dbName: `${this.dbName}Emotions`,
      selection: '*',
      extraStatement: `WHERE cravingId = ${cravingId}`
    });
  }

  addCravingEmotion(cravingId: number, emotionId: number) {
    return this.databaseProvider.insert({
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
    return this.databaseProvider.bulkInsert({ dbName: `${this.dbName}Emotions`, items })
  }

  getCravingFoods(cravingId: number) {
    return this.databaseProvider.select({
      dbName: `${this.dbName}Foods`,
      selection: '*',
      extraStatement: `WHERE cravingId = ${cravingId}`
    });
  }

  addCravingFood(cravingId: number, foodId: number) {
    return this.databaseProvider.insert({
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
    return this.databaseProvider.bulkInsert({ dbName: `${this.dbName}Foods`, items })
  }
}
