import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalService } from '../../../providers/modal.service';
import { FormService } from '../../../providers/form.service';

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

  intensityLevel: number = 1;
  hungerLevel: number = 1;
  type: string = '';
  date: string = '';
  time: string = '';
  triggerDescription: string = '';

  formType: string = 'craving';
  showMealType: boolean = this.formType === 'meal';

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalService: ModalService, public formService: FormService) {
  }

  ngOnInit() {
  }

  onFormTypeChange() {
    this.showMealType = this.formType === 'meal';
  }

  onFormItemChange({ item, value }) {
    this[item] = value;
  }

  dismissForm() {
    this.navCtrl.pop();
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

    return this.formService.submitBeforeMealForm({
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

    return this.formService.submitCravingForm({
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
    this.formService.clearBeforeForm();
  }
}
