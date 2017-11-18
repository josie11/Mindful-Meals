import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalService } from '../../../providers/modal.service';
import { FormService } from '../../../providers/form.service';
import { EmotionsListPage } from '../emotions-list/emotions-list';
import { FoodCravingsListPage } from '../foods-list/foods-list';
import {
  FormObject,
} from '../../../common/types';

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

  log: FormObject;
  formType: string;
  submit;
  cancel;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalService: ModalService, public formService: FormService) {
  }

  ngOnInit() {
    //prevent mutations!
    const log: FormObject = {...this.navParams.get('log')};

    this.log = log;
    this.formType = this.navParams.get('formType');
    this.submit = this.navParams.get('submit');
    this.cancel = this.navParams.get('cancel');
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
    this.cancel();
    this.dismissForm();
  }

  onSubmit() {
    this.submit(this.log)
    this.dismissForm();
  }

  ngOnDestroy() {

  }
}
