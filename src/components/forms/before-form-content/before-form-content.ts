import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalProvider } from '../../../providers/modal';
import { EmotionsListPage } from '../../../pages/log-forms/emotions-list/emotions-list';
import { FoodCravingsListPage } from '../../../pages/log-forms/foods-list/foods-list';

/**
 * Generated class for the BeforeFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'before-form-content',
  templateUrl: 'before-form-content.html'
})
export class BeforeFormContentComponent implements OnDestroy, OnInit {

  emotions: object;
  foods: object;
  @Input() intensityLevel: number;
  @Input() hungerLevel: number;
  @Input() type: string;
  @Input() date: string;
  @Input() time: string;
  @Input() triggerDescription: string;
  @Input() showMealType: boolean;
  @Input() emotionsBehaviorSubject;
  @Input() foodsBehaviorSubject;

  @Output() onFormItemChange = new EventEmitter();

  emotionsSubscription;
  foodsSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalProvider: ModalProvider) {
  }

  ngOnInit() {
    console.log(this.showMealType)
    this.emotionsSubscription = this.emotionsBehaviorSubject.subscribe(emotions => this.emotions = emotions);
    this.foodsSubscription = this.foodsBehaviorSubject.subscribe(foods => this.foods = foods);
  }

  onRangeChange({ name, number }) {
    this.onFormItemChange.emit({ item: name, value: number });
  }

  onTimeDateChange({ type, value }) {
    this.onFormItemChange.emit({ item: type, value });
  }

  onDescriptionChange({ value }) {
    this.onFormItemChange.emit({ item: 'triggerDescription', value });
  }

  onMealTypeChange(value) {
    this.onFormItemChange.emit({ item: 'type', value });
  }

  openEmotionsList() {
    this.modalProvider.presentModal(EmotionsListPage, { mealType: 'Before'});
  }

  openFoodsList() {
    this.modalProvider.presentModal(FoodCravingsListPage, { mealType: 'Before'});
  }

  ngOnDestroy() {
    this.emotionsSubscription.unsubscribe();
    this.foodsSubscription.unsubscribe();
  }
}
