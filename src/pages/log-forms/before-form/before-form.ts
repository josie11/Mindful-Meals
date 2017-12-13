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

  form: object = {};

  formType: string = 'craving';
  showMealType: boolean = this.formType === 'meal';
  formSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalService: ModalService, public formService: FormService) {
  }

  ngOnInit() {
    this.formSubscription = this.formService.form.subscribe((form) => this.form = form)
    this.formService.setForBeforeForm();
  }

  onFormTypeChange() {
    this.showMealType = this.formType === 'meal';
  }

  onFormItemChange({ item, value }) {
    this.formService.updateFormItem(item, value);
  }

  dismissForm() {
    this.navCtrl.pop();
  }

  submitForm() {
    if (this.formType === 'meal') this.submitMealForm();
    if (this.formType === 'craving') this.submitCravingForm();
  }

  submitMealForm() {
    this.formService.submitBeforeMealForm()
    .then(() => this.dismissForm());
  }

  submitCravingForm() {
    return this.formService.submitCravingForm()
    .then(() => this.dismissForm());
  }

  ngOnDestroy() {
    this.formService.clearBeforeForm();
    this.formSubscription.unsubscribe();
  }
}
