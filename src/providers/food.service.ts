import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { DatabaseService } from './database.service';
import 'rxjs/add/operator/map';

/*
  Generated class for the MealsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FoodsService {
  foodsList = new BehaviorSubject([]);

  constructor(private databaseService: DatabaseService) {
    this.getFoods();
  }

  getFoods() {
    return this.databaseService.select({ dbName: 'foods', selection: '*' })
    .then((data: any) => {
      this.foodsList.next(data);
      return data;
    });
  }

  addFood(name) {
    return this.databaseService.insert({
      dbName: 'foods',
      item: { name }
    })
    .then(id => {
      const foods = [...this.foodsList.getValue(), {...id, name }];
      this.foodsList.next(foods);
      return id;
    });
  }

  deleteFood(id) {
    return this.databaseService.executeSql(`DELETE from foods WHERE id = ${id};`)
    .then((data) => {
      const foods = this.foodsList.getValue().filter(food => food.id != id);
      this.foodsList.next(foods);
      return data;
    });
  }

  editFood(id, name) {
    return this.databaseService.executeSql(`UPDATE foods SET name = ${name} WHERE id = ${id};`)
    .then((data) => {
      const foods = this.foodsList.getValue();
      for (let food of foods) {
        if (food.id == id) food.name = name;
        return;
      }
      this.foodsList.next(foods);
      return data;
    });
  }

}
