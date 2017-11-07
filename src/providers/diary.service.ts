import { Injectable } from '@angular/core';
import { MealsService } from './meals.service';
import { CravingsService } from './craving.service';

import { BehaviorSubject } from "rxjs";
import groupBy from 'lodash.groupby';


import 'rxjs/add/operator/map';

/*
  Generated class for the DiaryService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DiaryService {

  meals: BehaviorSubject<object[]> = new BehaviorSubject([]);
  cravings: BehaviorSubject<object[]> = new BehaviorSubject([]);

  constructor(private mealsService: MealsService, private cravingsService: CravingsService) {
  }

  updateMealEntries(month, year) {

  }

  updateCravingEntries(month, year) {

  }

  getMealsForMonth(month: number, year: number) {
    const adjustedMonth = (month < 10) ? `0${month}` : month;
    return this.mealsService.getMealsForMonth(adjustedMonth, year)
    .then((meals) => {
      const mealsData = this.groupEntryResultsByDate('mealDate', meals);
      this.meals.next(mealsData);
    });
  }

  getCravingsForMonth(month: number, year: number) {
    const adjustedMonth = (month < 10) ? `0${month}` : month;
    return this.cravingsService.getCravingsForMonth(adjustedMonth, year)
    .then((cravings) => {
      const cravingsData = this.groupEntryResultsByDate('cravingDate', cravings);
      this.cravings.next(cravingsData);
    });
  }

  groupEntryResultsByDate(dateName: string, entries: object[]) {
    const dataObject = groupBy(entries, dateName);
    const dataArray = [];
    for (let date in dataObject) {
      dataArray.push(dataObject[date]);
    }
    return dataArray;
  }
}
