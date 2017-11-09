import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertService } from '../../../providers/alert.service';
import { ModalService } from '../../../providers/modal.service';
import { FormService } from '../../../providers/form.service';
import { MealsService } from '../../../providers/meals.service';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalService: ModalService, public alertService: AlertService, public formService: FormService, public mealsService: MealsService) {
  }

  ngOnInit() {
    //prevent mutations!
    const log: any = {...this.navParams.get('log')};
    const emotions: any = {...this.navParams.get('emotions')};
    const foods: any = {...this.navParams.get('foods')};

    log.emotions = emotions
    log.foods = foods

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
    this.modalService.presentModal(EmotionsListPage, { mealType: 'Before' });
  }

  openFoodsList() {
    this.modalService.presentModal(FoodCravingsListPage, { mealType: 'Before' });
  }

  onCancel() {
    //have to undo any edits to emotions/foods
    this.formService.updateBeforeEmotions(this.log['emotions']);
    this.formService.updateBeforeFoods(this.log['foods']);
    this.dismissForm();
  }

  onSubmit() {
    this.log['emotions'] = {...this.formService.selectedBeforeEmotions.getValue()};
    this.log['foods'] = {...this.formService.selectedBeforeFoods.getValue()};
    this.submit(this.log)
    this.dismissForm();
  }

  ngOnDestroy() {

  }
}
