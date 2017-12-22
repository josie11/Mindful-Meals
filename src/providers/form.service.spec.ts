import { TestBed, inject, fakeAsync, flushMicrotasks, async } from '@angular/core/testing';
import { ProvidersModule } from './providers.module';
import { Platform } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLitePorterMock, SQLiteMock, SQLiteObject } from '../common/mocks';
import { PlatformMock } from '../mocks';
import { IonicStorageModule } from '@ionic/storage';

import { FormService } from './form.service';
import { DatabaseService } from './database.service';
import { EmotionsService } from './emotion.service';
import { FoodsService } from './food.service';
import { DistractionsService } from './distraction.service';
import { MealsService } from './meals.service';
import { CravingsService } from './craving.service';
import { AppSetupService } from './app-setup.service';

describe('FormService', () => {
  let formService;

  let emotions;
  let foods;
  let distractions;

  let formEmotions;
  let formFoods;
  let formDistractions;
  let updatedFormFoods;
  let updatedFormEmotions;
  let updatedFormDistractions;

  const beforeFormDefaults = {
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

  const afterFormDefaults = {
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

  const beforeMealForm = {
    mealTime: '12:30:00',
    mealDate: '2017-12-31',
    hungerLevelBefore: 3,
    intensityLevel: 2,
    triggerDescription: 'Sadness, depression...',
    mealType: 'Lunch',
    completed: 0,
  };

  const completeMealForm = {
    mealTime: '08:30:00',
    mealDate: '2017-12-30',
    hungerLevelBefore: 1,
    hungerLevelAfter: 5,
    intensityLevel: 2,
    satisfactionLevel: 3,
    triggerDescription: 'Sadness, depression...',
    mealDescription: 'Hated every second of it',
    mealType: 'Breakfast',
    completed: 1,
  };

  const cravingForm = {
    cravingTime: '23:30:00',
    cravingDate: '2017-12-20',
    hungerLevelBefore: 3,
    intensityLevel: 2,
    triggerDescription: 'Sadness, depression...',
  };

  function createCraving() {
    formService.updateFormToCraving(cravingForm, formEmotions, formFoods);

    return formService.submitCravingForm()
    .then((data: any) => data);
  }

  function createBeforeMeal() {
    formService.updateFormToBeforeMeal(beforeMealForm, formEmotions, formFoods);

    return formService.submitBeforeMealForm()
    .then((data: any) => data);
  }

  function createCompleteMeal() {
    formService.updateFormToCompletedMeal(completeMealForm, formEmotions, formEmotions, formFoods, formFoods, formDistractions);

    return formService.submitNewAfterMealForm()
    .then((data: any) => data);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ProvidersModule, IonicStorageModule, IonicStorageModule.forRoot()],
      providers: [
        FormService,
        AppSetupService,
        DatabaseService,
        EmotionsService,
        FoodsService,
        DistractionsService,
        MealsService,
        CravingsService,
        {provide: SQLite, useClass: SQLiteMock},
        {provide: SQLitePorter, useClass: SQLitePorterMock },
        {provide: Platform, useClass: PlatformMock },
      ]
    });

    const appService = TestBed.get(AppSetupService);
    appService.initializeApp(1)
    .then(() => formService = TestBed.get(FormService));
  }));

  beforeEach(async(() => {
    const emotionService = TestBed.get(EmotionsService);
    const foodService = TestBed.get(FoodsService);
    const distractionService = TestBed.get(DistractionsService);

    emotions = emotionService.emotionsList.value;
    foods = foodService.foodsList.value;
    distractions = distractionService.distractionsList.value;

    formEmotions = { [emotions[0].id]: emotions[0].name, [emotions[1].id]: emotions[1].name };
    formFoods = { [foods[0].id]: foods[0].name, [foods[1].id]: foods[1].name };
    formDistractions = { [distractions[0].id]: distractions[0].name, [distractions[1].id]: distractions[1].name };

    updatedFormFoods = { [foods[2].id]: foods[2].name };
    updatedFormEmotions = { [emotions[2].id]: emotions[2].name, [emotions[0].id]: emotions[0].name, [emotions[3].id]: emotions[3].name };
    updatedFormDistractions = { [distractions[0].id]: distractions[0].name}
  }));

  afterEach(async(() => {
    const databaseService = TestBed.get(DatabaseService);
    databaseService.delete({dbName: 'meals'})
    .then(() => databaseService.delete({dbName: 'cravings' }))
    .then(() => databaseService.delete({dbName: 'cravingEmotions' }))
    .then(() => databaseService.delete({dbName: 'cravingFoods' }))
    .then(() => databaseService.delete({dbName: 'mealEmotions' }))
    .then(() => databaseService.delete({dbName: 'mealFoods' }))
    .then(() => databaseService.delete({dbName: 'mealDistractions' }))
    .then(() => formService.clearAfterForm());
  }));

  it('form defaults are set correctly', () => {
    expect(formService.getEmptyBeforeForm()).toEqual(beforeFormDefaults);
    expect(formService.getEmptyAfterForm()).toEqual(afterFormDefaults);
  });

  it('refresh form functions update the form behavior subject to defaults for before/after forms', () => {
    formService.form.next(beforeMealForm);

    expect(formService.form.value).toEqual(beforeMealForm);

    formService.setForBeforeForm();

    expect(formService.form.value).toEqual(formService.getEmptyBeforeForm())

    formService.form.next(completeMealForm);

    expect(formService.form.value).toEqual(completeMealForm);

    formService.setForAfterForm();

    expect(formService.form.value).toEqual(formService.getEmptyAfterForm())
  });

  it('clear form functions clear the form to defaults', () => {

  });

  it('can get after item ids via getSelectedAfterItemsIds', () => {

  });

  it('can update form to a before meal via updateFormToBeforeMeal', () => {

  });

  it('can update form to a complete meal via updateFormToCompletedMeal', () => {

  });

  it('can update form to a craving via updateFormToCraving', () => {

  });

  it('can get form data via form data getter methods', () => {

  });

  it('refreshFormToBeforeFormDefaults refreshes just before form items, leaves after form items intact', () => {
    formService.form.next(completeMealForm);

    expect(formService.form.value).toEqual(completeMealForm);

    formService.refreshFormToBeforeFormDefaults('2017-12-30', '23:33:00');

    const beforeFormPresets = {
      intensityLevel: 1,
      hungerLevelBefore:  1,
      date: '2017-12-30',
      time: '23:33:00',
      mealType: 'Breakfast',
      triggerDescription: '',
    };

    expect(formService.form.value).toEqual({ ...completeMealForm, ...beforeFormPresets});
  });

  it('can update a form item', () => {
    formService.updateFormItem('intensityLevel', 3);

    const updatedForm = {...beforeFormDefaults, ...{ intensityLevel: 3 } };
    expect(formService.form.value).toEqual(updatedForm);
  });

  it('can update form items', () => {
    const items = { intensityLevel: 3, mealType: 'Lunch' };
    formService.updateFormItems(items);

    expect(formService.form.value).toEqual({ ...beforeFormDefaults, ...items });
  });

  it('can update before and after emotions', () => {
    formService.updateBeforeEmotions(formEmotions);
    formService.updateAfterEmotions(formEmotions);

    expect(formService.selectedBeforeEmotions.value).toEqual(formEmotions);
    expect(formService.selectedAfterEmotions.value).toEqual(formEmotions);
  });

  it('can update before before and after foods', () => {
    formService.updateBeforeFoods(formFoods);
    formService.updateAfterFoods(formFoods);

    expect(formService.selectedBeforeFoods.value).toEqual(formFoods);
    expect(formService.selectedAfterFoods.value).toEqual(formFoods);
  });

  it('can update distractions', () => {
    formService.updateDistractions(formDistractions);

    expect(formService.selectedDistractions.value).toEqual(formDistractions);
  });

  it('can add new emotion via emotions service', () => {

  });

  it('can add new food', () => {

  });

  it('can add new distraction', () => {

  });

  it('can submit a new craving via submitCravingForm and link it with foods/emotions via linkCravingItemsWithCraving, form is clear afterwards', fakeAsync(() => {
    let craving;

    formService.updateFormItems(cravingForm);
    formService.updateBeforeEmotions(formEmotions);
    formService.updateBeforeFoods(formFoods);

    createCraving()
    .then((data: any) => craving = data);

    flushMicrotasks();

    expect(craving).toBeDefined();
    expect(craving.emotions).toBeDefined();
    expect(craving.foods).toBeDefined();

    expect(craving.cravingDate).toEqual(cravingForm.cravingDate);
    expect(craving.cravingTime).toEqual(cravingForm.cravingTime);
    expect(craving.hungerLevel).toEqual(cravingForm.hungerLevelBefore);
    expect(craving.intensityLevel).toEqual(cravingForm.intensityLevel);
    expect(craving.triggerDescription).toEqual(cravingForm.triggerDescription);

    expect(craving.emotions[0].name).toEqual(formEmotions[craving.emotions[0].id]);
    expect(craving.emotions[1].name).toEqual(formEmotions[craving.emotions[1].id]);

    expect(craving.foods[0].name).toEqual(formFoods[craving.foods[0].id]);
    expect(craving.foods[1].name).toEqual(formFoods[craving.foods[1].id]);

    expect(formService.form.value).toEqual(beforeFormDefaults);
    expect(formService.selectedBeforeEmotions.value).toEqual({});
    expect(formService.selectedBeforeFoods.value).toEqual({});
  }));

  it('can create a before meal via submitBeforeMealForm and link before items with the created meal and link items to meal via linkBeforeFormItemsWithMeal', fakeAsync(() => {
    let meal;

    createBeforeMeal()
    .then((data: any) => meal = data);

    flushMicrotasks();

    expect(meal).toBeDefined();
    expect(meal.beforeEmotions).toBeDefined();
    expect(meal.beforeFoods).toBeDefined();

    expect(meal.mealDate).toEqual(beforeMealForm.mealDate);
    expect(meal.mealTime).toEqual(beforeMealForm.mealTime);
    expect(meal.hungerLevelBefore).toEqual(beforeMealForm.hungerLevelBefore);
    expect(meal.intensityLevel).toEqual(beforeMealForm.intensityLevel);
    expect(meal.triggerDescription).toEqual(beforeMealForm.triggerDescription);
    expect(meal.mealType).toEqual(beforeMealForm.mealType);
    expect(meal.completed).toEqual(0);
    expect(meal.hungerLevelAfter).toBeNull();
    expect(meal.mealDescription).toBeNull();
    expect(meal.satisfactionLevel).toBeNull();


    expect(meal.beforeEmotions[0].name).toEqual(formEmotions[meal.beforeEmotions[0].id]);
    expect(meal.beforeEmotions[1].name).toEqual(formEmotions[meal.beforeEmotions[1].id]);
    expect(meal.beforeEmotions.length).toEqual(Object.keys(formEmotions).length);

    expect(meal.beforeFoods[0].name).toEqual(formFoods[meal.beforeFoods[0].id]);
    expect(meal.beforeFoods[1].name).toEqual(formFoods[meal.beforeFoods[1].id]);
    expect(meal.beforeFoods.length).toEqual(Object.keys(formFoods).length);

    expect(formService.form.value).toEqual(beforeFormDefaults);
    expect(formService.selectedBeforeEmotions.value).toEqual({});
    expect(formService.selectedBeforeFoods.value).toEqual({});
  }));

  it('can update an existing meals before items via updateBeforeMealItems', fakeAsync(() => {
    let meal;

    createBeforeMeal()
    .then((data: any) => {
      formService.updateFormToBeforeMeal(beforeMealForm, updatedFormEmotions, updatedFormFoods);
      return formService.updateBeforeMealItems(data.id, formEmotions, formFoods);
    })
    .then((data: any) => formService.mealsService.getMeal(data.id))
    .then((data: any) => meal = data);

    flushMicrotasks();

    expect(meal.beforeEmotions[0].name).toEqual(updatedFormEmotions[meal.beforeEmotions[0].emotionId]);
    expect(meal.beforeEmotions[1].name).toEqual(updatedFormEmotions[meal.beforeEmotions[1].emotionId]);
    expect(meal.beforeEmotions[2].name).toEqual(updatedFormEmotions[meal.beforeEmotions[2].emotionId]);
    expect(meal.beforeEmotions.length).toEqual(Object.keys(updatedFormEmotions).length);

    expect(meal.beforeFoods[0].name).toEqual(updatedFormFoods[meal.beforeFoods[0].foodId]);
    expect(meal.beforeFoods.length).toEqual(Object.keys(updatedFormFoods).length);
  }));

  it('can update an existing meals before/after updateAllMealItems', fakeAsync(() => {
    let meal;

    createCompleteMeal()
    .then((data: any) => {
      formService.updateFormToCompletedMeal(completeMealForm, updatedFormEmotions, updatedFormEmotions, updatedFormFoods, updatedFormFoods, updatedFormDistractions);
      return formService.updateAllMealItems(data.id, formEmotions, formFoods, formEmotions, formFoods, formDistractions);
    })
    .then((data: any) => formService.mealsService.getMeal(data.id))
    .then((data: any) => meal = data);

    flushMicrotasks();

    expect(meal.beforeEmotions[0].name).toEqual(updatedFormEmotions[meal.beforeEmotions[0].emotionId]);
    expect(meal.beforeEmotions[1].name).toEqual(updatedFormEmotions[meal.beforeEmotions[1].emotionId]);
    expect(meal.beforeEmotions[2].name).toEqual(updatedFormEmotions[meal.beforeEmotions[2].emotionId]);
    expect(meal.beforeEmotions.length).toEqual(Object.keys(updatedFormEmotions).length);

    expect(meal.beforeFoods[0].name).toEqual(updatedFormFoods[meal.beforeFoods[0].foodId]);
    expect(meal.beforeFoods.length).toEqual(Object.keys(updatedFormFoods).length);

    expect(meal.distractions.length).toEqual(Object.keys(updatedFormDistractions).length);
    expect(meal.distractions[0].name).toEqual(updatedFormDistractions[meal.distractions[0].distractionId]);

    expect(meal.afterEmotions[0].name).toEqual(updatedFormEmotions[meal.afterEmotions[0].emotionId]);
    expect(meal.afterEmotions[1].name).toEqual(updatedFormEmotions[meal.afterEmotions[1].emotionId]);
    expect(meal.afterEmotions[2].name).toEqual(updatedFormEmotions[meal.afterEmotions[2].emotionId]);
    expect(meal.afterEmotions.length).toEqual(Object.keys(updatedFormEmotions).length);

    expect(meal.afterFoods[0].name).toEqual(foods[2].name);
    expect(meal.afterFoods.length).toEqual(Object.keys(updatedFormFoods).length);
  }));

  it('can update an existing cravings items via updateCravingItems', () => {

  });

  it('can create a new complete meal via submitNewAfterMealForm', () => {

  });

  it('can update a meal for after meal details via submitAttachedMealAfterForm', () => {

  });

  it('can update a meal via submitMealUpdates', () => {

  });

  it('can update a craving via submitCravingUpdates', () => {

  });
});
