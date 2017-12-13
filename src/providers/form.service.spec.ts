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
    time: '12:30:00',
    date: '2017-12-31',
    hungerLevelBefore: 3,
    intensityLevel: 2,
    triggerDescription: 'Sadness, depression...',
    mealType: 'Lunch',
    completed: 0,
  };

  const completeMealForm = {
    time: '08:30:00',
    date: '2017-12-30',
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
    time: '23:30:00',
    date: '2017-12-20',
    hungerLevel: 3,
    intensityLevel: 2,
    triggerDescription: 'Sadness, depression...',
  };

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
  }));

  afterEach(async(() => {
    const databaseService = TestBed.get(DatabaseService);
    databaseService.delete({dbName: 'meals'})
    .then(() => databaseService.delete({dbName: 'cravings' }))
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

  });

  it('can update form items', () => {

  });

  it('can update before emotions', () => {

  });

  it('can update before foods', () => {

  });

  it('can update after foods', () => {

  });

  it('can add new emotion', () => {

  });

  it('can add new food', () => {

  });

  it('can add new distraction', () => {

  });

  it('can submit a new craving via submitCravingForm', () => {

  });

  it('can link before food/emotions with a craving via linkCravingItemsWithCraving', () => {

  });

  it('can link after items with a meal via linkAfterItemsWithMeal', () => {

  });

  it('can create a before meal via submitBeforeMealForm', () => {

  });

  it('can update an existing meals before items via updateBeforeMealItems', () => {

  });

  it('can update an existing meals before/after updateAllMealItems', () => {

  });

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
