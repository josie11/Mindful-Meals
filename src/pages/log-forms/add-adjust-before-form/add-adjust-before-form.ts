import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert';
import { ModalProvider } from '../../../providers/modal';
import { FormProvider } from '../../../providers/form';
import { MealsProvider } from '../../../providers/meals';
import { EmotionsListPage } from '../emotions-list/emotions-list';
import { FoodCravingsListPage } from '../foods-list/foods-list';

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
  submit;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalProvider: ModalProvider, public alertProvider: AlertProvider, public formProvider: FormProvider, public mealsProvider: MealsProvider) {
  }

  ngOnInit() {
    //prevent mutations!
    const log: any = {...this.navParams.get('log')};
    log.emotions = {...log.emotions}
    log.foods = {...log.foods}

    this.log = log;
    this.formType = this.navParams.get('formType');
    this.submit = this.navParams.get('submit');
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

  onCancel() {
    //have to undo any edits to emotions/foods
    this.formProvider.updateBeforeEmotions(this.log['emotions']);
    this.formProvider.updateBeforeFoods(this.log['foods']);
    this.dismissForm();
  }

  onSubmit() {
    this.log['emotions'] = {...this.formProvider.selectedBeforeEmotions.getValue()};
    this.log['foods'] = {...this.formProvider.selectedBeforeFoods.getValue()};
    this.submit(this.log)
    this.dismissForm();
  }

  ngOnDestroy() {

  }
}
