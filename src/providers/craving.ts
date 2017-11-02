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

  constructor(private databaseProvider: DatabaseProvider) {
  }

  getTodaysCravings(date) {
    return this.databaseProvider.select({ dbName: 'cravings', selection: '*', whereStatement: `WHERE cravingDate = ${date}`});
  }

  addCraving(cols: Array<string>, values: Array<string>) {
    return this.databaseProvider.insert({
      dbName: 'cravings',
      cols,
      values
    })
    .catch(console.error)
  }

  updateCraving() {

  }

  addCravingEmotion(cravingId: number, emotionId: number) {
    return this.databaseProvider.insert({
      dbName: 'cravingEmotions',
      cols: ['cravingId', 'emotionId'],
      values: [cravingId, emotionId]
    })
    .catch(console.error)
  }

  addCravingEmotions(cravingId: number, emotionIds: Array<number>) {
    const items = emotionIds.map(emotionId => ({
      cols: ['cravingId', 'emotionId'],
      values: [cravingId, emotionId]
    }));
    return this.databaseProvider.bulkInsert({ dbName: 'cravingEmotions', items })
  }

  addCravingFood(cravingId: number, foodId: number) {
    return this.databaseProvider.insert({
      dbName: 'cravingFoods',
      cols: ['cravingId', 'foodId'],
      values: [cravingId, foodId]
    })
    .catch(console.error)
  }

  addCravingFoods(cravingId: number, foodIds: Array<number>) {
    const items = foodIds.map(foodId => ({
      cols: ['cravingId', 'foodId'],
      values: [cravingId, foodId]
    }));
    return this.databaseProvider.bulkInsert({ dbName: 'cravingFoods', items })
  }
}
