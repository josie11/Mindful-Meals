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
 * Generated class for the AfterFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'edit-form',
  templateUrl: 'edit-form.html'
})
export class EditFormPage implements OnDestroy, OnInit {

  hungerLevel: number = 1;
  satisfactionLevel: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalProvider: ModalProvider, public alertProvider: AlertProvider, public formProvider: FormProvider, public mealsProvider: MealsProvider) {
  }

  ngOnInit() {

  }

  onRangeChange({ name, number }) {
    this[name] = number;
  }

  onTimeDateChange({ type, value }) {
    this[type] = value;
  }

  onDescriptionChange({ value }) {
    // this.mealDescription = value;
  }

  dismissForm() {
    this.navCtrl.pop();
  }

  openEmotionsList(stage) {
    this.modalProvider.presentModal(EmotionsListPage, { mealType: stage });
  }

  openFoodsList(stage) {
    this.modalProvider.presentModal(FoodCravingsListPage, { mealType: stage });
  }

  openDistractionsList() {
    this.modalProvider.presentModal(DistractionsListPage);
  }

  submitForm() {
    console.log(this)
  }

  ngOnDestroy() {

  }
}
