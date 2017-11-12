import { Injectable } from '@angular/core';
import { EmotionsService } from './emotion.service';
import { FoodsService } from './food.service';
import { DistractionsService } from './distraction.service';
import { MealsService } from './meals.service';
import { CravingsService } from './craving.service';

import { BehaviorSubject, Subject } from "rxjs";

import 'rxjs/add/operator/map';

/*
  To assist with the emotions/distractions modal communication
  And to submit form when complete
*/

interface formObject {
  time: string;
  date: string;
  hungerLevelBefore: number;
  intensityLevel: number;
  triggerDescription?: string;
  mealType: string;
  completed: number;
  satisfactionLevel?: number;
  hungerLevelAfter?: number;
  mealDescription?: string;
}

@Injectable()
export class FormService {

  selectedBeforeEmotions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedBeforeFoods: BehaviorSubject<object> = new BehaviorSubject({});

  selectedDistractions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedAfterEmotions: BehaviorSubject<object> = new BehaviorSubject({});
  selectedAfterFoods: BehaviorSubject<object> = new BehaviorSubject({});

  //fired when we create a new meal/craving --> to trigger update in diary view
  mealAdded: Subject<object> = new Subject();
  cravingAdded: Subject<object> = new Subject();

  //fired when we update a meal/craving --> to trigger update in diary view
  mealUpdated: Subject<object> = new Subject();
  cravingUpdated: Subject<object> = new Subject();

  form: BehaviorSubject<object> = new BehaviorSubject({
    time: '',
    date: '',
    hungerLevelBefore: 1,
    intensityLevel: 1,
    triggerDescription: '',
    mealType: 'Breakfast',
    completed: 0,
    satisfactionLevel: undefined,
    hungerLevelAfter: undefined,
    mealDescription: ''
  });

  constructor(
      private emotionsService: EmotionsService,
      private foodsService: FoodsService,
      private distractionsService: DistractionsService,
      private mealsService: MealsService,
      private cravingsService: CravingsService,
    ) {
  }

  refreshForm() {
    const beforeForm: formObject = {
      time: '',
      date: '',
      hungerLevelBefore: 1,
      intensityLevel: 1,
      triggerDescription: '',
      mealType: 'Breakfast',
      completed: 0,
      satisfactionLevel: undefined,
      hungerLevelAfter: undefined,
      mealDescription: ''
    };

    this.form.next(beforeForm)
  }

  setForAfterForm() {
    const beforeForm: formObject = {
      time: '',
      date: '',
      hungerLevelBefore: 1,
      intensityLevel: 1,
      triggerDescription: '',
      mealType: 'Breakfast',
      completed: 1,
      satisfactionLevel: 1,
      hungerLevelAfter: 1,
      mealDescription: ''
    };

    this.form.next(beforeForm)
  }

  updateFormItem(item: string, value: any) {
    const form = {...this.form.getValue()};
    form[item] = value;

    this.form.next({...form});
  }

  updateFormItems(items: object) {
    const form = {...this.form.getValue()};
    const updatedForm = {...form, ...items};

    this.form.next(updatedForm);
  }

  updateBeforeEmotions(emotions: object) {
    this.selectedBeforeEmotions.next({...emotions});
  }

  updateAfterEmotions(emotions: object) {
    this.selectedAfterEmotions.next({...emotions});
  }

  addNewEmotion(name: string) {
    return this.emotionsService.addEmotion(name)
    .then((data: any) => ({id : data.id, name}));
  }

  updateBeforeFoods(foods: object) {
    this.selectedBeforeFoods.next({...foods});
  }

  updateAfterFoods(foods: object) {
    this.selectedAfterFoods.next({...foods});
  }

  addNewFood(name: string) {
    return this.foodsService.addFood(name)
    .then((data: any) => ({id : data.id, name}));
  }

  updateDistractions(distractions: object) {
    this.selectedDistractions.next({...distractions});
  }

  addNewDistraction(name: string) {
    return this.distractionsService.addDistraction(name)
    .then((data: any) => ({id : data.id, name}));
  }

  linkBeforeFormItemsWithMeal(id: number) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();

    return this.mealsService.addMealEmotions(id, selectedBeforeEmotionIds, 'before')
    .then(() => this.mealsService.addMealFoods(id, selectedBeforeFoodsIds, 'before'))
    .then(() => ({id: id}));
  }

  submitCravingForm() {
    const form: any = this.form.getValue();

    const formData = {
      cravingTime: form.time,
      cravingDate: form.date,
      hungerLevel: form.hungerLevelBefore,
      intensityLevel: form.intensityLevel,
      triggerDescription: form.triggerDescription,
    }

    let id;

    return this.cravingsService.addCraving(formData)
    .then((data: any) => {
      id = data.id;
      return this.linkCravingItemsWithCraving(data.id);
    })
    .then(() => {
      this.clearBeforeForm();
      return this.cravingsService.getCraving(id);
    })
    .then((craving) => {
      this.cravingAdded.next(craving);
      return craving;
    });
  }

  linkCravingItemsWithCraving(id: number) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();

    return this.cravingsService.addCravingEmotions(id, selectedBeforeEmotionIds)
    .then(() => this.cravingsService.addCravingFoods(id, selectedBeforeFoodsIds))
    .then(() => ({id: id}));
  }

  linkAfterItemsWithMeal(id) {
    const { selectedAfterEmotionIds, selectedAfterFoodsIds, selectedDistractionsIds } = this.getSelectedAfterItemsIds();

    return this.mealsService.addMealEmotions(id, selectedAfterEmotionIds, 'after')
    .then(() => this.mealsService.addMealFoods(id, selectedAfterFoodsIds, 'after'))
    .then(() => this.mealsService.addMealDistractions(id, selectedDistractionsIds))
    .then(() => ({id: id}));
  }

  submitBeforeMealForm() {
    const formData = this.getBeforeFormData();
    let id;

    return this.mealsService.addMeal(formData)
    .then((data: any) => {
      id = data.id;
      return this.linkBeforeFormItemsWithMeal(data.id)
    })
    .then((data: any) => {
      this.clearBeforeForm();
      return this.mealsService.getMeal(id)
    })
    .then((meal) => {
      this.mealAdded.next(meal);
      return meal;
    });
  }

  updateBeforeMealItems(id: number, previousEmotions: object, previousFoods: object) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();
    const previousEmotionsIds = Object.keys(previousEmotions).map(val => Number(val));
    const previousFoodsIds = Object.keys(previousFoods).map(val => Number(val));

    return this.mealsService.updateMealEmotions(id, 'before', previousEmotionsIds, selectedBeforeEmotionIds)
    .then(() => this.mealsService.updateMealFoods(id, 'before', previousFoodsIds, selectedBeforeFoodsIds))
    .then(() => ({id: id}));
  }

  submitNewAfterMealForm() {
    const formData = this.getAfterFormData()
    //format for database insert method
    let id;

    return this.mealsService.addMeal(formData)
    .then((data: any) => {
      id = data.id;
      return this.linkBeforeFormItemsWithMeal(id);
    })
    .then((data: any) => this.linkBeforeFormItemsWithMeal(id))
    .then((data: any) => this.linkAfterItemsWithMeal(id))
    .then((data: any) => {
      this.clearAfterForm();
      return this.mealsService.getMeal(id);
    })
    .then((meal) => {
      this.mealAdded.next(meal);
      return meal;
    })
  }

  submitAttachedMealAfterForm(mealId: number, beforeEmotions, beforeFoods ) {
    const formData = this.getAfterFormData();

    return this.mealsService.updateMeal(mealId, formData)
    .then(() => this.updateBeforeMealItems(mealId, beforeEmotions, beforeEmotions))
    .then(() => this.linkAfterItemsWithMeal(mealId))
    .then(() => {
      this.clearAfterForm();
      return this.mealsService.getMeal(mealId)
    })
    .then((meal) => {
      this.mealUpdated.next(meal);
      return meal;
    });
  }

  clearBeforeForm() {
    this.selectedBeforeEmotions.next({});
    this.selectedBeforeFoods.next({});
    this.refreshForm();
  }

  clearAfterForm() {
    this.clearBeforeForm();
    this.selectedAfterEmotions.next({});
    this.selectedAfterFoods.next({});
    this.selectedDistractions.next({});
  }

  getSelectedBeforeItemsIds() {
    const selectedBeforeEmotionIds = Object.keys(this.selectedBeforeEmotions.getValue()).map(val => Number(val));
    const selectedBeforeFoodsIds = Object.keys(this.selectedBeforeFoods.getValue()).map(val => Number(val));

    return { selectedBeforeEmotionIds, selectedBeforeFoodsIds };
  }

  getSelectedAfterItemsIds() {
    const selectedAfterEmotionIds = Object.keys(this.selectedAfterEmotions.getValue()).map(val => Number(val));
    const selectedAfterFoodsIds = Object.keys(this.selectedAfterFoods.getValue()).map(val => Number(val));
    const selectedDistractionsIds = Object.keys(this.selectedDistractions.getValue()).map(val => Number(val));

    return { selectedAfterEmotionIds, selectedAfterFoodsIds, selectedDistractionsIds };
  }

  getBeforeFormData() {
    const form: any = this.form.getValue();

    return {
      mealTime: form.time,
      mealDate: form.date,
      hungerLevelBefore: form.hungerLevelBefore,
      intensityLevel: form.intensityLevel,
      triggerDescription: form.triggerDescription,
      mealType: form.mealType,
      completed: form.completed,
    }
  }

  getAfterFormData() {
    const form: any = this.form.getValue();

    return {
      mealTime: form.time,
      mealDate: form.date,
      hungerLevelBefore: form.hungerLevelBefore,
      hungerLevelAfter: form.hungerLevelAfter,
      intensityLevel: form.intensityLevel,
      satisfactionLevel: form.satisfactionLevel,
      triggerDescription: form.triggerDescription,
      mealDescription: form.mealDescription,
      mealType: form.mealType,
      completed: 1,
    }
  }
}
