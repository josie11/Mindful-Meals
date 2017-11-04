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
  attachedMeal: object = {};
  isMealAttached: boolean = false;

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

  openBeforeFormAddOrEdit() {
    this.modalProvider.presentModal(AddAdjustBeforeFormPage, { log: this.attachedMeal, formType: 'meal' });
  }

  beforeFormToggle(e) {
    this.toggle = !this.toggle;
    if (!this.isMealAttached) {
      this.presentBeforeMealPrompt();
    } else {
      this.isMealAttached = false;
      this.attachedMeal = {};
      this.formProvider.clearBeforeForm();
    }
  }

  linkWithExistingMeal(id) {
    if (id == this.attachedMeal['id']) return;
    return this.mealsProvider.getMeal(id).then((meal: any) => {
      if (meal.emotions.length > 0) this.formProvider.updateBeforeEmotions(this.mealsProvider.formatMealItemsToCheckboxObject(meal.emotions));
      if (meal.foods.length > 0) this.formProvider.updateBeforeFoods(this.mealsProvider.formatMealItemsToCheckboxObject(meal.foods));
      this.attachedMeal = meal
      this.isMealAttached = true;
    }).catch(console.error);
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
