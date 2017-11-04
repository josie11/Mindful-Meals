import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { AlertProvider } from '../../../providers/alert';
import { ModalProvider } from '../../../providers/modal';
import { FormProvider } from '../../../providers/form';
import { MealsProvider } from '../../../providers/meals';
import { EmotionsListPage } from '../emotions-list/emotions-list';
import { FoodCravingsListPage } from '../foods-list/foods-list';
import { DistractionsListPage } from '../distractions-list/distractions-list';
import { AddAdjustBeforeFormPage } from '../add-adjust-before-form/add-adjust-before-form';
/**
 * Generated class for the AfterFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-after-form',
  templateUrl: 'after-form.html',
  providers: [DatePipe]
})
export class AfterFormPage implements OnDestroy, OnInit {

  date: string = '';
  distractions: object = {};
  emotions: object = {};
  foods: object = {};
  formType: string = 'new';
  hungerLevel: number = 1;
  mealDescription: string = '';
  satisfactionLevel: number = 1;
  time: string = '';

  incompleteMeals: Array<object> = [];
  attachedMeal: any = {};
  isMealAttached: boolean = false;
  logEdits: any = {
    intensityLevel: 1,
    hungerLevel:  1,
    date:'',
    time: '',
    type: '',
    triggerDescription: '',
    emotions: {},
    foods: {}
  };

  toggle: boolean = false;

  emotionsSubscription;
  foodsSubscription;
  distractionsSubscription;

  constructor(private navCtrl: NavController, private modalProvider: ModalProvider, private alertProvider: AlertProvider, private formProvider: FormProvider, private mealsProvider: MealsProvider, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.emotionsSubscription = this.formProvider.selectedAfterEmotions.subscribe(emotions => this.emotions = emotions);
    this.foodsSubscription = this.formProvider.selectedAfterFoods.subscribe(foods => this.foods = foods);
    this.distractionsSubscription = this.formProvider.selectedDistractions.subscribe(distractions => this.distractions = distractions);
    this.mealsProvider.getIncompleteMeals().then(meals => this.incompleteMeals = meals);
  }

  onRangeChange({ name, number }) {
    this[name] = number;
  }

  onTimeDateChange({ type, value }) {
    this[type] = value;
  }

  onDescriptionChange({ value }) {
    this.mealDescription = value;
  }

  dismissForm() {
    this.navCtrl.pop();
  }

  openEmotionsList() {
    this.modalProvider.presentModal(EmotionsListPage, { mealType: 'After' });
  }

  openFoodsList() {
    this.modalProvider.presentModal(FoodCravingsListPage, { mealType: 'After' });
  }

  openDistractionsList() {
    this.modalProvider.presentModal(DistractionsListPage);
  }

  presentBeforeMealPrompt() {
    const options = this.incompleteMeals.map((meal: any) => ({
      value: meal.id,
      label: this.datePipe.transform(`${meal.mealDate}T${meal.mealTime}`, ' MMM d, y, h:mm a'),
      checked: false,
      type: 'radio'
    }))
    this.alertProvider.presentRadio({
      title: 'Incomplete Meal Logs',
      inputs: options,
      submitHandler: this.linkWithExistingMeal.bind(this)
    })
  }

  beforeFormToggle(e) {
    this.toggle = !this.toggle;
    if (!this.isMealAttached) {
      this.presentBeforeMealPrompt();
    } else {
      this.isMealAttached = false;
      this.attachedMeal = {};
      this.clearLogEdits();
    }
  }

  linkWithExistingMeal(id) {
    if (id == this.attachedMeal['id']) return;
    return this.mealsProvider.getMeal(id).then((meal: any) => {
      const formattedEmotions = this.mealsProvider.formatMealItemsToCheckboxObject(meal.emotions);
      const formattedFoods = this.mealsProvider.formatMealItemsToCheckboxObject(meal.foods);

      if (meal.emotions.length > 0) this.formProvider.updateBeforeEmotions(formattedEmotions);
      if (meal.foods.length > 0) this.formProvider.updateBeforeFoods(formattedFoods);

      this.attachedMeal = meal
      this.isMealAttached = true;

      this.setLogToAttachedMeal({...formattedEmotions}, {...formattedFoods});
    }).catch(console.error);
  }

  openBeforeLogAddOrEdit() {
    this.modalProvider.presentModal(
      AddAdjustBeforeFormPage,
      {
        log: this.logEdits,
        formType: 'meal',
        submit: this.submitLogEdits.bind(this)
      });
  }

  setLogToAttachedMeal(emotions, foods) {
    const {
      mealTime,
      mealDate,
      mealType,
      hungerLevelBefore,
      intensityLevel,
      triggerDescription
    } = this.attachedMeal;

    this.logEdits = {
      intensityLevel,
      hungerLevel:  hungerLevelBefore,
      date: mealDate,
      time: mealTime,
      type: mealType,
      triggerDescription: triggerDescription,
      emotions,
      foods
    };
  }

  submitLogEdits(log) {
    this.logEdits = log;
  }

  clearLogEdits() {
    this.logEdits = {
      intensityLevel: 1,
      hungerLevel:  1,
      date:'',
      time: '',
      type: '',
      triggerDescription: '',
      emotions: {},
      foods: {}
    };
    this.formProvider.clearBeforeForm();
  }

  submitForm() {
    console.log(this)
  }

  ngOnDestroy() {
    this.emotionsSubscription.unsubscribe();
    this.foodsSubscription.unsubscribe();
    this.distractionsSubscription.unsubscribe();
    this.formProvider.clearAfterForm();
  }
}
