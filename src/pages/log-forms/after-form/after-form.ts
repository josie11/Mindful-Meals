import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../../providers/alert.service';
import { ModalService } from '../../../providers/modal.service';
import { FormService } from '../../../providers/form.service';
import { MealsService } from '../../../providers/meals.service';
import { EmotionsListPage } from '../emotions-list/emotions-list';
import { FoodCravingsListPage } from '../foods-list/foods-list';
import { DistractionsListPage } from '../distractions-list/distractions-list';
import { AddAdjustBeforeFormPage } from '../add-adjust-before-form/add-adjust-before-form';
/**
 * Generated class for the AfterFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-after-form',
  templateUrl: 'after-form.html',
  providers: [DatePipe]
})
export class AfterFormPage implements OnDestroy, OnInit {

  distractions: object = {};
  emotions: object = {};
  foods: object = {};
  hungerLevel: number = 1;
  mealDescription: string = '';
  satisfactionLevel: number = 1;

  incompleteMeals: Array<object> = [];
  attachedMeal: any = {};
  isMealAttached: boolean = false;

  //represents before meal data
  logEdits: any = {
    intensityLevel: 1,
    hungerLevel:  1,
    date:'',
    time: '',
    type: '',
    triggerDescription: '',
    emotions: {},
    foods: {}
  };

  toggle: boolean = false;

  emotionsSubscription;
  foodsSubscription;
  distractionsSubscription;

  constructor(private navCtrl: NavController, private modalService: ModalService, private alertService: AlertService, private formService: FormService, private mealsService: MealsService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.emotionsSubscription = this.formService.selectedAfterEmotions.subscribe(emotions => this.emotions = emotions);
    this.foodsSubscription = this.formService.selectedAfterFoods.subscribe(foods => this.foods = foods);
    this.distractionsSubscription = this.formService.selectedDistractions.subscribe(distractions => this.distractions = distractions);
    this.mealsService.getIncompleteMeals().then(meals => this.incompleteMeals = meals);
  }

  onRangeChange({ name, number }) {
    this[name] = number;
  }

  onTimeDateChange({ type, value }) {
    this.logEdits[type] = value;
  }

  onDescriptionChange({ value }) {
    this.mealDescription = value;
  }

  dismissForm() {
    this.navCtrl.pop();
  }

  openEmotionsList() {
    this.modalService.presentModal(EmotionsListPage, { mealType: 'After' });
  }

  openFoodsList() {
    this.modalService.presentModal(FoodCravingsListPage, { mealType: 'After' });
  }

  openDistractionsList() {
    this.modalService.presentModal(DistractionsListPage);
  }

  beforeFormToggle(e) {
    this.toggle = !this.toggle;
    if (!this.isMealAttached) {
      this.presentBeforeMealPrompt();
    } else {
      this.isMealAttached = false;
      this.attachedMeal = {};
      this.clearLogEdits();
    }
  }

  presentBeforeMealPrompt() {
    const options = this.incompleteMeals.map((meal: any) => ({
      value: meal.id,
      label: this.datePipe.transform(`${meal.mealDate}T${meal.mealTime}`, ' MMM d, y, h:mm a'),
      checked: false,
      type: 'radio'
    }))
    this.alertService.presentRadio({
      title: 'Incomplete Meal Logs',
      inputs: options,
      submitHandler: this.linkWithExistingMeal.bind(this)
    })
  }

  linkWithExistingMeal(id) {
    if (id == this.attachedMeal['id']) return;
    return this.mealsService.getMeal(id).then((meal: any) => {
      const formattedEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeEmotions);
      const formattedFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeFoods);

      if (meal.beforeEmotions.length > 0) this.formService.updateBeforeEmotions(formattedEmotions);
      if (meal.beforeFoods.length > 0) this.formService.updateBeforeFoods(formattedFoods);

      this.attachedMeal = meal
      this.isMealAttached = true;

      this.setLogToAttachedMeal({...formattedEmotions}, {...formattedFoods});
    }).catch(console.error);
  }

  openBeforeLogAddOrEdit() {
    this.modalService.presentModal(
      AddAdjustBeforeFormPage,
      {
        log: this.logEdits,
        formType: 'meal',
        submit: this.submitLogEdits.bind(this)
      });
  }

  setLogToAttachedMeal(emotions, foods) {
    const {
      mealTime,
      mealDate,
      mealType,
      hungerLevelBefore,
      intensityLevel,
      triggerDescription
    } = this.attachedMeal;

    this.logEdits = {
      intensityLevel,
      hungerLevel:  hungerLevelBefore,
      date: mealDate,
      time: mealTime,
      type: mealType,
      triggerDescription: triggerDescription,
      emotions,
      foods
    };
  }

  submitLogEdits(log) {
    this.logEdits = log;
  }

  clearLogEdits() {
    //have to do this here or triggers on change check error
    const newDate = new Date();
    const date = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    const time = this.datePipe.transform(newDate, 'HH:mm');

    this.logEdits = {
      intensityLevel: 1,
      hungerLevel:  1,
      date: date,
      time: time,
      type: '',
      triggerDescription: '',
      emotions: {},
      foods: {}
    };

    this.formService.clearBeforeForm();
  }

  submitForm() {
    if (this.isMealAttached) this.submitUpdateForm()
    else this.submitNewForm();
  }

  returnFormData() {
    const {
      intensityLevel,
      hungerLevel,
      type,
      date,
      time,
      triggerDescription,
    } = this.logEdits;

    const {
      mealDescription,
      satisfactionLevel,
    } = this;

    const hungerLevelAfter = this.hungerLevel;

    return {
      intensityLevel,
      hungerLevelBefore: hungerLevel,
      mealType: type,
      mealDate: date,
      mealTime: time,
      triggerDescription,
      completed: 1,
      hungerLevelAfter,
      mealDescription,
      satisfactionLevel
    }
  }

  submitNewForm() {
    const formData = this.returnFormData();

    return this.formService.submitNewAfterMealForm(formData)
    .then(() => this.dismissForm())
    .catch(console.error);

  }

  submitUpdateForm() {
    const formData = this.returnFormData();
    const { id } = this.attachedMeal;
    const beforeEmotions = this.mealsService.formatMealItemsToCheckboxObject(this.attachedMeal.beforeEmotions);
    const beforeFoods = this.mealsService.formatMealItemsToCheckboxObject(this.attachedMeal.beforeFoods);

    return this.formService.submitAttachedMealAfterForm(id, formData, beforeEmotions, beforeFoods)
    .then(() => this.dismissForm())
    .catch(console.error);
  }

  ngOnDestroy() {
    this.emotionsSubscription.unsubscribe();
    this.foodsSubscription.unsubscribe();
    this.distractionsSubscription.unsubscribe();
    this.formService.clearAfterForm();
  }
}
