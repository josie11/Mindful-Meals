import { Injectable } from '@angular/core';
import { DatabaseProvider } from './database';
import { EmotionsProvider } from './emotion';
import { FoodsProvider } from './food';
import { BehaviorSubject } from "rxjs";

import 'rxjs/add/operator/map';

/*
  To assist with the emotions/distractions modal communication
  And to submit form when complete
*/
@Injectable()
export class BeforeFormProvider {
  selectedEmotions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedFoods: BehaviorSubject<object> = new BehaviorSubject({});

  constructor(private databaseProvider: DatabaseProvider, public emotionsProvider: EmotionsProvider, public foodsProvider: FoodsProvider) {
  }

  updateEmotions(emotions) {
    this.selectedEmotions.next({...emotions});
  }

  addNewEmotion(name) {
    return this.emotionsProvider.addEmotion(name)
    .then((data: any) => {
      const selectedEmotions = {...this.selectedEmotions.getValue()};
      selectedEmotions[data.id] = name;
      return {id : data.id, name};
    })
    .catch(console.error)
  }

  updateFoods(foods) {
    this.selectedFoods.next({...foods});
  }

  addNewFood(name) {
    return this.foodsProvider.addFood(name)
    .then((data: any) => {
      const selectedFoods = {...this.selectedFoods.getValue()};
      selectedFoods[data.id] = name;
      return {id : data.id, name};
    })
    .catch(console.error)
  }

}
