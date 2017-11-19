import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LogService } from '../../../providers/log.service';
import { AlertService } from '../../../providers/alert.service';

import {
  LogMeal,
  FormObject
} from '../../../common/types';

@Component({
  selector: 'meal-log-page',
  templateUrl: 'meal-log.html'
})
export class MealLogPage implements OnInit, OnDestroy {

  meal: any = {};
  mealId: number;
  form: object = {};

  editing: boolean = false;
  mealStage: string = 'before';

  mealSubscription;
  formSubscription;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private logService: LogService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.mealId = this.navParams.get('id');
    this.mealSubscription = this.logService.meal.subscribe((meal: LogMeal) => this.meal = meal);
    this.formSubscription = this.logService.getFormSubscription().subscribe((form: FormObject) => this.form = form);
    this.logService.getMealById(this.mealId);
  }

  dismiss() {
    this.navCtrl.pop();
  }

  nextMeal() {
    this.logService.getNextMeal();
  }

  previousMeal() {
    this.logService.getPreviousMeal();
  }

  onMealItemChange({ item, value }) {
    this.logService.onFormItemChange(item, value);
  }

  toggleEditView() {
    if (!this.editing) this.logService.updateFormToMeal();
    this.editing = !this.editing;
  }

  submitMealChanges() {
    this.logService.submitMealChanges()
    .then(() => this.toggleEditView());
  }

  cancelMealChanges() {
    this.toggleEditView();
    this.logService.clearLogChanges();
  }

  triggerMealDeletePrompt() {
    this.alertService.presentConfirm({
      title: 'Delete Meal',
      message: 'Confirm Log Deletion.',
      submitButtonText: 'Delete',
      submitHandler: this.onMealDelete.bind(this)
    })
  }

  onMealDelete() {
    this.logService.deleteMeal(this.meal.id, this.meal.mealDate);
    //will clear logService w/ ngondestroy
    this.dismiss();
  }

  ngOnDestroy() {
    this.mealSubscription.unsubscribe();
    this.formSubscription.unsubscribe();
    this.logService.clearMeal();
    this.logService.clearLogChanges();
  }
}
