import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { DatabaseService } from './database.service';
import 'rxjs/add/operator/map';

@Injectable()
export class EmotionsService {
  emotionsList = new BehaviorSubject([]);

  constructor(private databaseService: DatabaseService) {
    this.getEmotions();
  }

  getEmotions() {
    return this.databaseService.select({ dbName: 'emotions', selection: '*'})
    .then((data) => {
      this.emotionsList.next(data);
      return data;
    });
  }

  addEmotion(name) {
    return this.databaseService.insert({
      dbName: 'emotions',
      cols: ['name'],
      values: [name]
    })
    .then(id => {
      const emotions = [...this.emotionsList.getValue(), {...id, name }]
      this.emotionsList.next(emotions);
      return id;
    });
  }

  deleteEmotion(id) {
    return this.databaseService.executeSql(`DELETE from emotions WHERE id = ${id};`)
    .then((data) => {
      const emotions = this.emotionsList.getValue().filter(emotion => emotion.id != id);
      this.emotionsList.next(emotions);
      return data;
    });
  }

  editEmotion(id, name) {
    return this.databaseService.executeSql(`UPDATE emotions SET name = ${name} WHERE id = ${id};`)
    .then((data) => {
      const emotions = [...this.emotionsList.getValue()];
      for (let emotion of emotions) {
        if (emotion.id == id) emotion.name = name;
        return;
      }
      this.emotionsList.next(emotions);
      return data;
    });
  }

}
