import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  templateUrl: 'before-form.html',
  providers: [DatePipe]
})
export class BeforeFormPage implements OnDestroy, OnInit {

  emotions: object = {};
  foods: object = {};
  intensityLevel: number = 1;
  hungerLevelBefore: number = 1;
  mealType: string = '';
  mealDate: string;
  mealTime: string;
  triggerDescription: string = '';

  formType: string = 'craving';

  emotionsSubscription;
  foodsSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public datePipe: DatePipe, public modalProvider: ModalProvider, public formProvider: FormProvider) {
  }

  ngOnInit() {
    //automatically generate date/time to current for form
    this.mealDate = this.datePipe.transform(new Date(), 'mediumDate');
    this.mealTime = this.datePipe.transform(new Date(), 'shortTime');

    this.emotionsSubscription = this.formProvider.selectedBeforeEmotions.subscribe(emotions => this.emotions = emotions);
    this.foodsSubscription = this.formProvider.selectedBeforeFoods.subscribe(foods => this.foods = foods);
  }

  onRangeChange({ name, number }) {
    this[name] = number;
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
    const {
      intensityLevel,
      hungerLevelBefore,
      mealType,
      mealDate,
      mealTime,
      triggerDescription,
    } = this;

    this.formProvider.submitBeforeForm({
      intensityLevel,
      hungerLevelBefore,
      mealType,
      mealDate,
      mealTime,
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
