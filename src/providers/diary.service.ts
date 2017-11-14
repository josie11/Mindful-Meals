import { Injectable } from '@angular/core';
import { MealsService } from './meals.service';
import { CravingsService } from './craving.service';
import { FormService } from './form.service';
import {
    Craving,
    Meal
  } from '../common/types';
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

  allMeals: object = {};
  allCravings: object = {};
  month: number;
  year: number;
  date: BehaviorSubject<Date>;

  constructor(private mealsService: MealsService, private cravingsService: CravingsService, private formService: FormService) {
    const date = new Date();
    //months start at 0 for date object
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.date = new BehaviorSubject(new Date());

    formService.cravingUpdated.subscribe((craving: Craving) => this.checkIfShouldRefreshCravings(craving));
    formService.mealUpdated.subscribe((meal: Meal) => this.checkIfShouldRefreshMeals(meal));
    formService.cravingAdded.subscribe((craving: Craving) => this.checkIfShouldRefreshCravings(craving));
    formService.mealAdded.subscribe((meal: Meal) => this.checkIfShouldRefreshMeals(meal));
  }

  decreaseCurrentMonth() {
    if (this.month === 1) {
      this.month = 12;
      this.year -= 1;
    } else {
      this.month -= 1;
    }
    this.updateDateToMonthAndYear();
    this.updateEntries();
  }

  increaseCurrentMonth() {
    if (this.month === 12) {
      this.month = 1;
      this.year += 1;
    } else {
      this.month += 1;
    }
    this.updateDateToMonthAndYear();
    this.updateEntries();
  }

  updateDateToMonthAndYear() {
    this.date.next(new Date(this.year, this.month - 1));
  }

  setDateAndUpdateEntries(month: number, year: number) {
    this.month = month;
    this.year = year;
    this.updateDateToMonthAndYear();
    this.updateEntries();
  }

  updateEntries() {
    return this.getMealsForMonth(this.month, this.year, true)
    .then(() => this.getCravingsForMonth(this.month, this.year, true))
  }

  checkIfShouldRefreshCravings(craving: any) {
    const cravingDate = new Date(craving.cravingDate);
    const year = cravingDate.getFullYear();
    const month = cravingDate.getMonth() + 1;

    if (this.allCravings[`${year}-${month}`]) return this.getCravingsForMonth(month, year);

    return Promise.resolve();
  }

  checkIfShouldRefreshMeals(meal: any) {
    const mealDate = new Date(meal.mealDate);
    const year = mealDate.getFullYear();
    const month = mealDate.getMonth() + 1;

    if (this.allMeals[`${year}-${month}`]) return this.getMealsForMonth(month, year)

    return Promise.resolve();
  }

  getMealsForMonth(month: number, year: number, checkIfAlreadyRequested = false) {
    if (checkIfAlreadyRequested && this.allMeals[`${year}-${month}`]) return Promise.resolve(this.meals.next(this.allMeals[`${year}-${month}`]));
    const adjustedMonth = (month < 10) ? `0${month}` : month;
    return this.mealsService.getMealsForMonth(adjustedMonth, year)
    .then((meals: Partial<Meal>[]) => this.handleNewMealsResults(month, year, meals));
  }

  getCravingsForMonth(month: number, year: number, checkIfAlreadyRequested = false) {
    if (checkIfAlreadyRequested && this.allCravings[`${year}-${month}`]) return Promise.resolve(this.cravings.next(this.allCravings[`${year}-${month}`]));
    const adjustedMonth = (month < 10) ? `0${month}` : month;
    return this.cravingsService.getCravingsForMonth(adjustedMonth, year)
    .then((cravings: Partial<Craving>[]) => this.handleNewCravingsResults(month, year, cravings));
  }

  handleNewMealsResults(month: number, year: number, meals: Partial<Meal>[]) {
    const mealsData = this.groupEntryResultsByDate('mealDate', meals);
    this.allMeals[`${year}-${month}`] = mealsData;
    if(this.year === year && this.month === month) this.meals.next(mealsData);
  }

  handleNewCravingsResults(month: number, year: number, cravings: Partial<Craving>[]) {
    const cravingsData = this.groupEntryResultsByDate('cravingDate', cravings);
    this.allCravings[`${year}-${month}`] = cravingsData;
    if(this.year === year && this.month === month) this.cravings.next(cravingsData);
  }

  groupEntryResultsByDate(dateName: string, entries: Partial<Craving>[] | Partial<Meal>[]) {
    const dataObject = groupBy(entries, dateName);
    const dataArray = [];
    for (let date in dataObject) {
      dataArray.push(dataObject[date]);
    }
    return dataArray;
  }
}
