import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert';
import { ModalProvider } from '../../../providers/modal';
import { FormProvider } from '../../../providers/form';
import { MealsProvider } from '../../../providers/meals';
import { EmotionsListPage } from '../emotions-list/emotions-list';
import { FoodCravingsListPage } from '../foods-list/foods-list';
import { DistractionsListPage } from '../distractions-list/distractions-list';

/**
 * Generated class for the AddAjustBeforeFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'add-adjust-before-form',
  templateUrl: 'add-adjust-before-form.html'
})
export class AddAdjustBeforeFormPage implements OnDestroy, OnInit {

  log: object;
  formType: string;
  date: string;
  time: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalProvider: ModalProvider, public alertProvider: AlertProvider, public formProvider: FormProvider, public mealsProvider: MealsProvider) {
  }

  ngOnInit() {
    this.log = this.navParams.get('log');
    this.formType = this.navParams.get('formType');
    this.time = this.log[`${this.formType}Time`];
    this.date = this.log[`${this.formType}Date`];
  }

  onFormItemChange({ item, value }) {
    this.log[item] = value;
  }

  dismissForm() {
    this.navCtrl.pop();
  }

  openEmotionsList() {
    this.modalProvider.presentModal(EmotionsListPage, { mealType: 'Before' });
  }

  openFoodsList() {
    this.modalProvider.presentModal(FoodCravingsListPage, { mealType: 'Before' });
  }

  submitForm() {
    console.log(this)
  }

  ngOnDestroy() {

  }
}
