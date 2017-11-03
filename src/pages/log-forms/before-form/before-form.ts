import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalProvider } from '../../../providers/modal';
import { FormProvider } from '../../../providers/form';
import { EmotionsListPage } from '../emotions-list/emotions-list';
import { FoodCravingsListPage } from '../foods-list/foods-list';

/**
 * Generated class for the BeforeFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-before-form',
  templateUrl: 'before-form.html'
})
export class BeforeFormPage implements OnDestroy, OnInit {

  emotions: object = {};
  foods: object = {};
  intensityLevel: number = 1;
  hungerLevel: number = 1;
  type: string = '';
  date: string = '';
  time: string = '';
  triggerDescription: string = '';

  formType: string = 'craving';

  emotionsSubscription;
  foodsSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalProvider: ModalProvider, public formProvider: FormProvider) {
  }

  ngOnInit() {
    this.emotionsSubscription = this.formProvider.selectedBeforeEmotions.subscribe(emotions => this.emotions = emotions);
    this.foodsSubscription = this.formProvider.selectedBeforeFoods.subscribe(foods => this.foods = foods);
  }

  onRangeChange({ name, number }) {
    this[name] = number;
  }

  onTimeDateChange({ type, value }) {
    this[type] = value;
  }

  onDescriptionChange({ value }) {
    this.triggerDescription = value;
    console.log(this.triggerDescription, value)
  }

  dismissForm() {
    this.navCtrl.pop();
  }

  openEmotionsList() {
    this.modalProvider.presentModal(EmotionsListPage, { mealType: 'Before'});
  }

  openFoodsList() {
    this.modalProvider.presentModal(FoodCravingsListPage, { mealType: 'Before'});
  }

  submitForm() {
    if (this.formType === 'meal') this.submitMealForm();
    if (this.formType === 'craving') this.submitCravingForm();
  }

  submitMealForm() {
    const {
      intensityLevel,
      hungerLevel,
      type,
      date,
      time,
      triggerDescription,
    } = this;

    return this.formProvider.submitBeforeMealForm({
      intensityLevel,
      hungerLevelBefore: hungerLevel,
      mealType: type,
      mealDate: date,
      mealTime: time,
      triggerDescription,
    })
    .then(() => this.dismissForm())
    .catch(console.error);
  }

  submitCravingForm() {
    const {
      intensityLevel,
      hungerLevel,
      date,
      time,
      triggerDescription,
    } = this;

    return this.formProvider.submitCravingForm({
      intensityLevel,
      hungerLevel,
      cravingDate: date,
      cravingTime: time,
      triggerDescription,
    })
    .then(() => this.dismissForm())
    .catch(console.error);
  }

  ngOnDestroy() {
    this.emotionsSubscription.unsubscribe();
    this.foodsSubscription.unsubscribe();
    this.formProvider.clearBeforeForm();
  }
}
