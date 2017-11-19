import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalService } from '../../../providers/modal.service';
import { EmotionsListPage } from '../../../pages/log-forms/emotions-list/emotions-list';
import { DistractionsListPage } from '../../../pages/log-forms/distractions-list/distractions-list';
import { FoodCravingsListPage } from '../../../pages/log-forms/foods-list/foods-list';

/**
 * Generated class for the BeforeFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'after-form-content',
  templateUrl: 'after-form-content.html'
})
export class AfterFormContentComponent implements OnDestroy, OnInit {

  emotions: object;
  foods: object;
  distractions: object;

  @Input() satisfactionLevel: number;
  @Input() hungerLevelAfter: number;
  @Input() mealDescription: string;
  @Input() emotionsBehaviorSubject;
  @Input() foodsBehaviorSubject;
  @Input() distractionsBehaviorSubject;

  @Output() onFormItemChange = new EventEmitter();

  emotionsSubscription;
  foodsSubscription;
  distractionsSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalService: ModalService) {
  }

  ngOnInit() {
    this.emotionsSubscription = this.emotionsBehaviorSubject.subscribe(emotions => this.emotions = emotions);
    this.foodsSubscription = this.foodsBehaviorSubject.subscribe(foods => this.foods = foods);
    this.distractionsSubscription = this.distractionsBehaviorSubject.subscribe(distractions => this.distractions = distractions);
  }

  onRangeChange({ name, number }) {
    this.onFormItemChange.emit({ item: name, value: number });
  }

  onDescriptionChange({ value }) {
    this.onFormItemChange.emit({ item: 'mealDescription', value });
  }

  openEmotionsList() {
    this.modalService.presentModal(EmotionsListPage, { mealType: 'After'});
  }

  openFoodsList() {
    this.modalService.presentModal(FoodCravingsListPage, { mealType: 'After'});
  }

  openDistractionsList() {
    this.modalService.presentModal(DistractionsListPage);
  }

  ngOnDestroy() {
    this.emotionsSubscription.unsubscribe();
    this.foodsSubscription.unsubscribe();
    this.distractionsSubscription.unsubscribe();
  }
}
