import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { DatabaseProvider } from './database';
import 'rxjs/add/operator/map';

@Injectable()
export class EmotionsProvider {
  emotionsList = new BehaviorSubject([]);

  constructor(private databaseProvider: DatabaseProvider) {
    this.getEmotions();
  }

  getEmotions() {
    return this.databaseProvider.select({ dbName: 'emotions', selection: '*'})
    .then((data) => {
      this.emotionsList.next(data);
      return data;
    })
    .catch(console.error);
  }

  addEmotion(name) {
    return this.databaseProvider.insert({
      dbName: 'emotions',
      cols: ['name'],
      values: [name]
    })
    .then(id => {
      const emotions = [...this.emotionsList.getValue(), {...id, name }]
      this.emotionsList.next(emotions);
      return id;
    })
    .catch(console.error);
  }

  deleteEmotion(id) {
    return this.databaseProvider.executeSql(`DELETE from emotions WHERE id = ${id};`)
    .then((data) => {
      const emotions = this.emotionsList.getValue().filter(emotion => emotion.id != id);
      this.emotionsList.next(emotions);
      return data;
    })
    .catch(console.error);
  }

  editEmotion(id, name) {
    return this.databaseProvider.executeSql(`UPDATE emotions SET name = ${name} WHERE id = ${id};`)
    .then((data) => {
      const emotions = [...this.emotionsList.getValue()];
      for (let emotion of emotions) {
        if (emotion.id == id) emotion.name = name;
        return;
      }
      this.emotionsList.next(emotions);
      return data;
    })
    .catch(console.error);
  }

}
