import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { DatabaseService } from './database.service';
import 'rxjs/add/operator/map';

/*
  Generated class for the DistractionsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DistractionsService {
  distractionsList = new BehaviorSubject([]);

  constructor(private databaseService: DatabaseService) {
    this.getDistractions();
  }

  getDistractions() {
    return this.databaseService.select({ dbName: 'distractions', selection: '*' })
    .then((data: any) => {
      this.distractionsList.next(data);
      return data;
    })
  }

  addDistraction(name) {
    return this.databaseService.insert({
      dbName: 'distractions',
      item: { name }
    })
    .then(id => {
      const distractions = [...this.distractionsList.getValue(), {...id, name }];
      this.distractionsList.next(distractions);
      return id;
    })
  }

  deleteDistraction(id) {
    return this.databaseService.executeSql(`DELETE from distractions WHERE id = ${id};`)
    .then((data) => {
      const distractions = this.distractionsList.getValue().filter(distraction => distraction.id != id);
      this.distractionsList.next(distractions);
      return data;
    })
  }

  editDistraction(id, name) {
    return this.databaseService.executeSql(`UPDATE distractions SET name = ${name} WHERE id = ${id};`)
    .then((data) => {
      const distractions = this.distractionsList.getValue();
      for (let distraction of distractions) {
        if (distraction.id == id) distraction.name = name;
        return;
      }
      this.distractionsList.next(distractions);
      return data;
    })
  }

}
