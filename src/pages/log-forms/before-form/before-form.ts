import { Component, OnDestroy, OnInit, ApplicationRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController, NavParams } from 'ionic-angular';
import { ModalProvider } from '../../../providers/modal';
import { BeforeFormProvider } from '../../../providers/before-form';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public datePipe: DatePipe, public modalProvider: ModalProvider, public bfProvider: BeforeFormProvider, private ref: ApplicationRef) {
  }

  ngOnInit() {
    //automatically generate date/time to current for form
    this.date = this.datePipe.transform(new Date(), 'mediumDate');
    this.time = this.datePipe.transform(new Date(), 'shortTime');

    this.emotionsSubscription = this.bfProvider.selectedEmotions.subscribe(emotions => {
      this.emotions = emotions;
      this.ref.tick();
    });
    this.foodsSubscription = this.bfProvider.selectedFoods.subscribe(foods => this.foods = foods);
  }

  onRangeChange({ name, number }) {
    this[name] = number;
  }


  dismissForm() {
    this.navCtrl.pop();
  }

  openEmotionsList() {
    this.modalProvider.presentModal(EmotionsListPage);
  }

  openFoodsList() {
    this.modalProvider.presentModal(FoodCravingsListPage);
  }

  submitForm() {
    console.log(this)
  }

  ngOnDestroy() {
    this.emotionsSubscription.unsubscribe();
    this.foodsSubscription.unsubscribe();
  }
}
