import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalService } from '../../providers/modal.service';
import { MealsService} from '../../providers/meals.service';
import { CravingsService} from '../../providers/craving.service';
import { DiaryService } from '../../providers/diary.service';
import { MealLogPage } from '../meal-log/meal-log';

@Component({
  selector: 'diary-page',
  templateUrl: 'diary.html'
})
export class DiaryPage implements OnInit, OnDestroy {

  meals: object = [];
  cravings: object = [];
  year: number;
  month: number;
  currentMonth: number;
  currentYear: number;
  listingType: string = 'craving';
  isMeal: boolean = false;

  mealEntriesSubscription;
  cravingEntriesSubscription;

  constructor(public navCtrl: NavController, private modalService: ModalService, public mealsService: MealsService, public cravingsService: CravingsService, private diaryService: DiaryService) {
  }

  ngOnInit() {
    const date = new Date();
    //months start at 0 for date object
    this.currentMonth = date.getMonth() + 1;
    this.currentYear = date.getFullYear();
    this.month = this.currentMonth;
    this.year = this.currentYear;

    this.mealEntriesSubscription = this.diaryService.meals.subscribe((meals) => this.meals = meals);
    this.cravingEntriesSubscription = this.diaryService.cravings.subscribe((cravings) => this.cravings = cravings);

    this.getEntries().catch(console.error);
  }

  getEntries() {
    return this.diaryService.getCravingsForMonth(this.currentMonth, this.currentYear)
    .then(() => this.diaryService.getMealsForMonth(this.currentMonth, this.currentYear))
  }

  openMealLog(id) {
    this.modalService.presentModal(MealLogPage, { id });
  }

  selectPreviousMonth() {
    this.decreaseCurrentMonth();
    return this.getEntries()
    .catch(console.error);
  }

  selectNextMonth() {
    this.increaseCurrentMonth();
    return this.getEntries()
    .catch(console.error);
  }

  decreaseCurrentMonth() {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear -= 1;
    } else {
      this.currentMonth -= 1;
    }
  }

  increaseCurrentMonth() {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear += 1;
    } else {
      this.currentMonth += 1;
    }
  }

  onDateChange() {
    this.diaryService.updateMonthYear(this.currentMonth, this.currentYear)
  }

  ngOnDestroy() {
    this.mealEntriesSubscription.unsubscribe();
    this.cravingEntriesSubscription.unsubscribe();
  }
}
