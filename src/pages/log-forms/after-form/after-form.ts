import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController, NavParams } from 'ionic-angular';
import { ModalProvider } from '../../../providers/modal';
import { FormProvider } from '../../../providers/form';
import { EmotionsListPage } from '../emotions-list/emotions-list';
import { FoodCravingsListPage } from '../foods-list/foods-list';
import { DistractionsListPage } from '../distractions-list/distractions-list';

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
  description: string = '';
  distractions: object = {};
  emotions: object = {};
  foods: object = {};
  formType: string = 'new';
  hungerLevel: number = 1;
  satisfactionLevel: number = 1;
  time: string;

  emotionsSubscription;
  foodsSubscription;
  distractionsSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public datePipe: DatePipe, public modalProvider: ModalProvider, public formProvider: FormProvider) {
  }

  ngOnInit() {
    //automatically generate date/time to current for form
    this.date = this.datePipe.transform(new Date(), 'mediumDate');
    this.time = this.datePipe.transform(new Date(), 'shortTime');

    this.emotionsSubscription = this.formProvider.selectedAfterEmotions.subscribe(emotions => this.emotions = emotions);
    this.foodsSubscription = this.formProvider.selectedAfterFoods.subscribe(foods => this.foods = foods);
    this.distractionsSubscription = this.formProvider.selectedDistractions.subscribe(distractions => this.distractions = distractions);
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

  openDistractionsList() {
    this.modalProvider.presentModal(DistractionsListPage);
  }

  presentBeforeMealAlert() {

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
