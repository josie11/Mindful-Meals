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

  cravingSubscription;

  constructor(public navCtrl: NavController, private navParams: NavParams, private logService: LogService) {
  }

  ngOnInit() {
    this.cravingId = this.navParams.get('id');
    this.cravingSubscription = this.logService.craving.subscribe((craving) => this.craving = craving);
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

  ngOnDestroy() {
    this.cravingSubscription.unsubscribe();
    this.logService.clearCraving();
  }
}
