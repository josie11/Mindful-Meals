import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LogService } from '../../../providers/log.service';


@Component({
  selector: 'craving-log-page',
  templateUrl: 'craving-log.html'
})
export class CravingLogPage implements OnInit, OnDestroy {

  craving: object = {};
  cravingId: number;
  form: object = {};

  editing: boolean = false;

  cravingSubscription;
  formSubscription;

  constructor(public navCtrl: NavController, private navParams: NavParams, private logService: LogService) {
  }

  ngOnInit() {
    this.cravingId = this.navParams.get('id');
    this.cravingSubscription = this.logService.craving.subscribe((craving) => this.craving = craving);
    this.formSubscription = this.logService.getFormSubscription().subscribe((form) => this.form = form);
    this.logService.getCraving(this.cravingId).catch(console.error);
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
    this.logService.submitcravingChanges()
    .then(() => {
      this.toggleEditView();
      this.logService.clearLogChanges();
    });
  }

  cancelCravingChanges() {
    this.toggleEditView();
    this.logService.clearLogChanges();
  }

  ngOnDestroy() {
    this.cravingSubscription.unsubscribe();
    this.formSubscription.unsubscribe();
    this.logService.clearCraving();
  }
}
