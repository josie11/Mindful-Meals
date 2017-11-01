import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { DatabaseProvider } from './database';
import 'rxjs/add/operator/map';

/*
  Generated class for the DistractionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DistractionsProvider {
  distractionsList = new BehaviorSubject([]);

  constructor(private databaseProvider: DatabaseProvider) {
    this.getDistractions();
  }

  getDistractions() {
    return this.databaseProvider.select('SELECT * from distractions;')
    .then((data: any) => {
      this.distractionsList.next(data);
      return data;
    })
    .catch(console.error);
  }

  addDistraction(name) {
    return this.databaseProvider.insert(`INSERT INTO distractions (name) VALUES ('${name}');`, 'distractions')
    .then(id => {
      const distractions = [...this.distractionsList.getValue(), {...id, name }];
      this.distractionsList.next(distractions);
      return id;
    })
    .catch(console.error);
  }

  deleteDistraction(id) {
    return this.databaseProvider.executeSql(`DELETE from distractions WHERE id = ${id};`)
    .then((data) => {
      const distractions = this.distractionsList.getValue().filter(distraction => distraction.id != id);
      this.distractionsList.next(distractions);
      return data;
    })
    .catch(console.error);
  }

  editDistraction(id, name) {
    return this.databaseProvider.executeSql(`UPDATE distractions SET name = ${name} WHERE id = ${id};`)
    .then((data) => {
      const distractions = this.distractionsList.getValue();
      for (let distraction of distractions) {
        if (distraction.id == id) distraction.name = name;
        return;
      }
      this.distractionsList.next(distractions);
      return data;
    })
    .catch(console.error);
  }

}
