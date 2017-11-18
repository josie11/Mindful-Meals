import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertService } from '../../../providers/alert.service';
import { LogService } from '../../../providers/log.service';
import {
  LogCraving,
  FormObject
} from '../../../common/types';

@Component({
  selector: 'craving-log-page',
  templateUrl: 'craving-log.html'
})
export class CravingLogPage implements OnInit, OnDestroy {

  craving: LogCraving | any = {};
  cravingId: number;
  form: object = {};

  editing: boolean = false;

  cravingSubscription;
  formSubscription;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private logService: LogService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.cravingId = this.navParams.get('id');
    this.cravingSubscription = this.logService.craving.subscribe((craving: LogCraving) => this.craving = craving);
    this.formSubscription = this.logService.getFormSubscription().subscribe((form: FormObject) => this.form = form);
    this.logService.getCraving(this.cravingId);
  }

  dismiss() {
    this.navCtrl.pop();
  }

  nextCraving() {
    this.logService.getNextCraving();
  }

  previousCraving() {
    this.logService.getPreviousCraving();
  }

  onCravingItemChange({ item, value }) {
    this.logService.onFormItemChange(item, value);
  }

  toggleEditView() {
    if (!this.editing) this.logService.updateFormToCraving();
    this.editing = !this.editing;
  }

  submitCravingChanges() {
    this.logService.submitCravingChanges()
    .then(() => {
      this.toggleEditView();
      this.logService.clearLogChanges();
    });
  }

  cancelCravingChanges() {
    this.toggleEditView();
    this.logService.clearLogChanges();
  }

  triggerCravingDeletePrompt() {
    this.alertService.presentConfirm({
      title: 'Delete Craving',
      message: 'Confirm Log Deletion.',
      submitButtonText: 'Delete',
      submitHandler: this.onCravingDelete.bind(this)
    })
  }

  onCravingDelete() {
    this.logService.deleteCraving(this.craving.id, this.craving.cravingDate);
    //will clear logService w/ ngondestroy
    this.dismiss();
  }

  ngOnDestroy() {
    this.cravingSubscription.unsubscribe();
    this.formSubscription.unsubscribe();
    this.logService.clearCraving();
  }
}
