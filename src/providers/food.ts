import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { DatabaseProvider } from './database';
import 'rxjs/add/operator/map';

/*
  Generated class for the MealsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FoodsProvider {
  foodsList = new BehaviorSubject([]);

  constructor(private databaseProvider: DatabaseProvider) {
    this.getFoods();
  }

  getFoods() {
    return this.databaseProvider.select({ dbName: 'foods', selection: '*' })
    .then((data: any) => {
      this.foodsList.next(data);
      return data;
    })
    .catch(console.error);
  }

  addFood(name) {
    return this.databaseProvider.insert({
      dbName: 'foods',
      cols: ['name'],
      values: [name]
    })
    .then(id => {
      const foods = [...this.foodsList.getValue(), {...id, name }];
      this.foodsList.next(foods);
      return id;
    })
    .catch(console.error);
  }

  deleteFood(id) {
    return this.databaseProvider.executeSql(`DELETE from foods WHERE id = ${id};`)
    .then((data) => {
      const foods = this.foodsList.getValue().filter(food => food.id != id);
      this.foodsList.next(foods);
      return data;
    })
    .catch(console.error);
  }

  editFood(id, name) {
    return this.databaseProvider.executeSql(`UPDATE foods SET name = ${name} WHERE id = ${id};`)
    .then((data) => {
      const foods = this.foodsList.getValue();
      for (let food of foods) {
        if (food.id == id) food.name = name;
        return;
      }
      this.foodsList.next(foods);
      return data;
    })
    .catch(console.error);
  }

}
