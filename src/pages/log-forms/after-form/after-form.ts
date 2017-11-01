import { Component, OnDestroy, OnInit, ApplicationRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController, NavParams } from 'ionic-angular';
import { ModalProvider } from '../../../providers/modal';
import { FormProvider } from '../../../providers/form';
import { EmotionsListPage } from '../emotions-list/emotions-list';
import { FoodCravingsListPage } from '../foods-list/foods-list';

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

  date: string;
  emotions: object = {};
  foods: object = {};
  meal: string;
  time: string;
  intensity: number = 1;
  hungerLevel: number = 1;
  trigger: string = '';
  formType: string = 'craving';

  emotionsSubscription;
  foodsSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public datePipe: DatePipe, public modalProvider: ModalProvider, public formProvider: FormProvider, private ref: ApplicationRef) {
  }

  ngOnInit() {
    this.emotionsSubscription = this.formProvider.selectedAfterEmotions.subscribe(emotions => {
      this.emotions = emotions;
      this.ref.tick();
    });
    this.foodsSubscription = this.formProvider.selectedAfterFoods.subscribe(foods => this.foods = foods);
  }

  onRangeChange({ name, number }) {
    this[name] = number;
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

  submitForm() {
    console.log(this)
  }

  ngOnDestroy() {
    this.emotionsSubscription.unsubscribe();
    this.foodsSubscription.unsubscribe();
    this.formProvider.clearAfterForm();
  }
}
