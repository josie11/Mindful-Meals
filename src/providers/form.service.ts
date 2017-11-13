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

  /**
   * refreshes form behavior subject to before form defaults.
  */
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

  /**
   * refreshes form behavior subject to be ready to after form defaults.
  */
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

  /**
   * updates a single property on the form.
   *
   * @param {item} form property to be updated.
   *
   * @param {value} value to update property to.
  */
  updateFormItem(item: string, value: any) {
    const form = {...this.form.getValue()};
    form[item] = value;

    this.form.next({...form});
  }

  /**
   * updates multiple properties on the form.
   *
   * @param {items} on object representing multiple form properties/values.
  */
  updateFormItems(items: object) {
    const form = {...this.form.getValue()};
    const updatedForm = {...form, ...items};

    this.form.next(updatedForm);
  }

  /**
   * updates beforeEmotions behavior subject.
   *
   * @param {emotions} an object of emotions {id: name}.
  */
  updateBeforeEmotions(emotions: object) {
    this.selectedBeforeEmotions.next({...emotions});
  }

  /**
   * updates afterEmotions behavior subject.
   *
   * @param {emotions} an object of emotions {id: name}.
  */
  updateAfterEmotions(emotions: object) {
    this.selectedAfterEmotions.next({...emotions});
  }

  /**
   * Creates a new emotion.
   *
   * @param {name} name of emotion to create.
   *
   * @return {object} returns object {id: name} of new emotion
  */
  addNewEmotion(name: string) {
    return this.emotionsService.addEmotion(name)
    .then((data: any) => ({id : data.id, name}));
  }

  /**
   * updates beforeFoods behavior subject.
   *
   * @param {foods} an object of foods {id: name}.
  */
  updateBeforeFoods(foods: object) {
    this.selectedBeforeFoods.next({...foods});
  }

  /**
   * updates AfterFoods behavior subject.
   *
   * @param {foods} an object of foods {id: name}.
  */
  updateAfterFoods(foods: object) {
    this.selectedAfterFoods.next({...foods});
  }

  /**
   * Creates a new food.
   *
   * @param {name} name of food to create.
   *
   * @return {object} returns object {id: name} of new food
  */
  addNewFood(name: string) {
    return this.foodsService.addFood(name)
    .then((data: any) => ({id : data.id, name}));
  }

  /**
   * updates distractions behavior subject.
   *
   * @param {distractions} an object of distractions {id: name}.
  */
  updateDistractions(distractions: object) {
    this.selectedDistractions.next({...distractions});
  }

  /**
   * Creates a new distraction.
   *
   * @param {name} name of distraction to create.
   *
   * @return {object} returns object {id: name} of new distraction.
  */
  addNewDistraction(name: string) {
    return this.distractionsService.addDistraction(name)
    .then((data: any) => ({id : data.id, name}));
  }

  /**
   * Links beforeEmotions and beforeFoods with a meal.
   *
   * @param {mealId} The meal id to link items with.
   *
   * @return {object} returns object {id : mealId}.
  */
  linkBeforeFormItemsWithMeal(mealId: number) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();

    return this.mealsService.addMealEmotions(mealId, selectedBeforeEmotionIds, 'before')
    .then(() => this.mealsService.addMealFoods(mealId, selectedBeforeFoodsIds, 'before'))
    .then(() => ({id: mealId}));
  }

  /**
   * Creates a new craving using.
   *
   * @return {object} returns newly created craving.
  */
  submitCravingForm() {
    const formData = this.getCravingFormData();

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

  /**
   * Links beforeEmotions and beforeFoods with a craving. Cravings only have on
   * type emotions/foods (not distinct before/after versions), but the before-form
   * is used to create either craving or a meal, so when submitting a new craving
   * we pull data from before versions.
   *
   * @param {cravingId} The meal id to link items with.
   *
   * @return {object} returns object {id : cravingId}.
  */
  linkCravingItemsWithCraving(cravingId: number) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();

    return this.cravingsService.addCravingEmotions(cravingId, selectedBeforeEmotionIds)
    .then(() => this.cravingsService.addCravingFoods(cravingId, selectedBeforeFoodsIds))
    .then(() => ({id: cravingId}));
  }

  /**
   * Links afterEmotions and afterFoods with a meal.
   *
   * @param {mealId} The meal id to link items with.
   *
   * @return {object} returns object {id : mealId}.
  */
  linkAfterItemsWithMeal(mealId) {
    const { selectedAfterEmotionIds, selectedAfterFoodsIds, selectedDistractionsIds } = this.getSelectedAfterItemsIds();

    return this.mealsService.addMealEmotions(mealId, selectedAfterEmotionIds, 'after')
    .then(() => this.mealsService.addMealFoods(mealId, selectedAfterFoodsIds, 'after'))
    .then(() => this.mealsService.addMealDistractions(mealId, selectedDistractionsIds))
    .then(() => ({id: mealId}));
  }

  /**
   * Used by before form to submit a new meal log with only info relevant to before meal.
   *
   * @return {object} returns newly created meal.
  */
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

  /**
   * Updates beforeEmotions and beforeFoods. Used primarily in the after form to
   * edit an attached meal log. A User will log their pre-meal/post-meal experience
   * all at once or seperately. If done seperately, they will have selected a
   * existing log representing their before meal experience, to attach to their after
   * log, and have the option to edit its properties. This will update any edits
   * made on the before log items upon form submission.
   *
   * @param {mealId} The meal id.
   *
   * @param {previousEmotions} The beforeEmotions already associated with the meal.
   *
   * @param {previousFoods} The beforeFoods already associated with the meal.
   *
   * @return {object} returns object {id : mealId}.
  */
  updateBeforeMealItems(mealId: number, previousEmotions: object, previousFoods: object) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();
    const previousEmotionsIds = Object.keys(previousEmotions).map(val => Number(val));
    const previousFoodsIds = Object.keys(previousFoods).map(val => Number(val));

    return this.mealsService.updateMealEmotions(mealId, 'before', previousEmotionsIds, selectedBeforeEmotionIds)
    .then(() => this.mealsService.updateMealFoods(mealId, 'before', previousFoodsIds, selectedBeforeFoodsIds))
    .then(() => ({id: mealId}));
  }

  /**
   * Similar to updateBeforeMealItems
   *
   * @param {cravingId} The craving id.
   *
   * @param {previousEmotions} The beforeEmotions already associated with the craving.
   *
   * @param {previousFoods} The beforeFoods already associated with the craving.
   *
   * @return {object} returns object {id : cravingId}.
  */
  updateCravingItems(cravingId: number, previousEmotions: object, previousFoods: object) {
    const { selectedBeforeEmotionIds, selectedBeforeFoodsIds } = this.getSelectedBeforeItemsIds();
    const previousEmotionsIds = Object.keys(previousEmotions).map(val => Number(val));
    const previousFoodsIds = Object.keys(previousFoods).map(val => Number(val));

    return this.cravingsService.updateCravingEmotions(cravingId, previousEmotionsIds, selectedBeforeEmotionIds)
    .then(() => this.cravingsService.updateCravingFoods(cravingId, previousFoodsIds, selectedBeforeFoodsIds))
    .then(() => ({id: cravingId}));
  }

  /**
   * Creates a entirely new completed meal log. The user has not selected a before
   * log in the after log form.
   *
   * @return {object} returns meal object.
  */
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

  /**
   * Updates a existing meal log (created from the before meal form) with form data,
   * and marks it as completed. It will update and before meal items as well that
   * may have been edited by user. Associates after items with updated meal.
   *
   * @param {mealId} The meal id to be updated.
   *
   * @param {previousEmotions} The beforeEmotions already associated with the meal.
   *
   * @param {previousFoods} The beforeFoods already associated with the meal.
   *
   * @return {object} returns meal object.
  */
  submitAttachedMealAfterForm(mealId: number, previousEmotions, previousFoods ) {
    const formData = this.getAfterFormData();

    return this.mealsService.updateMeal(mealId, formData)
    .then(() => this.updateBeforeMealItems(mealId, previousEmotions, previousFoods))
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

  /**
   * Updates a existing craving log
   *
   * @param {cravingId} The meal id to be updated.
   *
   * @param {previousEmotions} The beforeEmotions already associated with the meal.
   *
   * @param {previousFoods} The beforeFoods already associated with the meal.
   *
   * @return {object} returns meal object.
  */
  submitCravingUpdates(cravingId: number, previousEmotions, previousFoods) {
    const formData = this.getCravingFormData();

    return this.cravingsService.updateCraving(cravingId, formData)
    .then(() => this.updateCravingItems(cravingId, previousEmotions, previousFoods))
    .then(() => {
      this.clearAfterForm();
      return this.cravingsService.getCraving(cravingId);
    })
    .then((craving) => {
      this.cravingUpdated.next(craving);
      return craving;
    });
  }

  /**
   * clears all before form items and form itself.
  */
  clearBeforeForm() {
    this.selectedBeforeEmotions.next({});
    this.selectedBeforeFoods.next({});
    this.refreshForm();
  }

  /**
   * clears all before form items and form itself.
   * clears all after form items.
  */
  clearAfterForm() {
    this.clearBeforeForm();
    this.selectedAfterEmotions.next({});
    this.selectedAfterFoods.next({});
    this.selectedDistractions.next({});
  }

  /**
   * maps before form items objects into an array of ids.
   *
   * @return {object} returns object with before emotion and foods ids in arrays.
  */
  getSelectedBeforeItemsIds() {
    const selectedBeforeEmotionIds = Object.keys(this.selectedBeforeEmotions.getValue()).map(val => Number(val));
    const selectedBeforeFoodsIds = Object.keys(this.selectedBeforeFoods.getValue()).map(val => Number(val));

    return { selectedBeforeEmotionIds, selectedBeforeFoodsIds };
  }

  /**
   * maps before form items objects into an array of ids.
   *
   * @return {object} returns object with before emotion and foods ids in arrays.
  */
  getSelectedAfterItemsIds() {
    const selectedAfterEmotionIds = Object.keys(this.selectedAfterEmotions.getValue()).map(val => Number(val));
    const selectedAfterFoodsIds = Object.keys(this.selectedAfterFoods.getValue()).map(val => Number(val));
    const selectedDistractionsIds = Object.keys(this.selectedDistractions.getValue()).map(val => Number(val));

    return { selectedAfterEmotionIds, selectedAfterFoodsIds, selectedDistractionsIds };
  }

  /**
   * Updates form behavior subjects for selected before items (emotion/foods) on form service
   * Updates form to with before log items to a given meal. Needed for editing log.
   *
   * @param {meal} object representing meal
   *
   * @param {emotions} object representing cravings associated emotions
   *
   * * @param {foods} object representing cravings associated foods
  */
  updateFormToBeforeMeal(meal, emotions, foods) {
    const {
      mealTime,
      mealDate,
      mealType,
      hungerLevelBefore,
      intensityLevel,
      triggerDescription
    } = meal;

    this.updateFormItems({
      intensityLevel,
      hungerLevelBefore,
      date: mealDate,
      time: mealTime,
      mealType,
      triggerDescription,
    });

    this.updateBeforeEmotions(emotions);
    this.updateBeforeFoods(foods);
  }

  /**
   * Takes a craving and its emotions/foods and updates form with its values
   *
   * @param {craving} object representing craving
   *
   * @param {emotions} object representing cravings associated emotions
   *
   * * @param {foods} object representing cravings associated foods
  */
  updateFormToCraving(craving, emotions, foods) {
    const {
      cravingTime,
      cravingDate,
      hungerLevel,
      intensityLevel,
      triggerDescription,
    } = craving;

    this.updateFormItems({
      intensityLevel,
      hungerLevelBefore: hungerLevel,
      date: cravingDate,
      time: cravingTime,
      triggerDescription,
    });

    this.updateBeforeEmotions(emotions);
    this.updateBeforeFoods(foods);
  }

  /**
   * returns formatted data from the form object to be submitted to database.
   * Only specific columns are submitted with craving.
   *
   * @return {object} returns object with form data with correction column names that match database.
  */
  getCravingFormData() {
    const form: any = this.form.getValue();

    return {
      cravingTime: form.time,
      cravingDate: form.date,
      hungerLevel: form.hungerLevelBefore,
      intensityLevel: form.intensityLevel,
      triggerDescription: form.triggerDescription,
    }
  }

  /**
   * returns formatted data from the form object to be submitted to database.
   * Only specific columns are submitted with before form.
   *
   * @return {object} returns object with form data with correction column names that match database.
  */
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

  /**
   * returns formatted data from the form object to be submitted to database.
   *
   * @return {object} returns object with form data with correction column names that match database.
  */
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
