import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalService } from '../../../providers/modal.service';
import { MealsService} from '../../../providers/meals.service';
import { CravingsService} from '../../../providers/craving.service';
import { DiaryService } from '../../../providers/diary.service';
import { MealLogPage } from '../meal-log/meal-log';
import { CravingLogPage } from '../craving-log/craving-log';

import {
  Craving,
  Meal
} from '../../../common/types';

@Component({
  selector: 'diary-page',
  templateUrl: 'diary.html'
})
export class DiaryPage implements OnInit, OnDestroy {

  meals: Meal[] = [];
  cravings: Craving[] = [];
  date: Date = new Date();
  listingType: string = 'craving';
  isMeal: boolean = false;

  mealEntriesSubscription;
  cravingEntriesSubscription;
  dateSubscription;

  constructor(public navCtrl: NavController, private modalService: ModalService, public mealsService: MealsService, public cravingsService: CravingsService, private diaryService: DiaryService) {
  }

  ngOnInit() {
    this.mealEntriesSubscription = this.diaryService.meals.subscribe((meals: Meal[]) => this.meals = meals);
    this.cravingEntriesSubscription = this.diaryService.cravings.subscribe((cravings: Craving[]) => this.cravings = cravings);
    this.dateSubscription = this.diaryService.date.subscribe((date: Date) => this.date = date);

    const date = new Date();
    this.diaryService.setDateAndUpdateEntries(date.getMonth() + 1, date.getFullYear());
  }

  openMealLog(id) {
    this.modalService.presentModal(MealLogPage, { id });
  }

  openCravingLog(id) {
    this.modalService.presentModal(CravingLogPage, { id });
  }

  selectPreviousMonth() {
    this.diaryService.decreaseCurrentMonth();
  }

  selectNextMonth() {
    this.diaryService.increaseCurrentMonth();
  }

  ngOnDestroy() {
    this.mealEntriesSubscription.unsubscribe();
    this.cravingEntriesSubscription.unsubscribe();
    this.dateSubscription.unsubscribe();
  }
}
