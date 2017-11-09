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

  adjustedBeforeEmotions: object = {};
  adjustedBeforeFoods: object = {}

  form: any = {};

  incompleteMeals: Array<object> = [];
  attachedMeal: any = {};
  isMealAttached: boolean = false;

  toggle: boolean = false;

  emotionsSubscription;
  foodsSubscription;
  distractionsSubscription;
  formSubscription;

  constructor(private navCtrl: NavController, private modalService: ModalService, private alertService: AlertService, private formService: FormService, private mealsService: MealsService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.emotionsSubscription = this.formService.selectedAfterEmotions.subscribe(emotions => this.emotions = emotions);
    this.foodsSubscription = this.formService.selectedAfterFoods.subscribe(foods => this.foods = foods);
    this.distractionsSubscription = this.formService.selectedDistractions.subscribe(distractions => this.distractions = distractions);
    this.mealsService.getIncompleteMeals().then(meals => this.incompleteMeals = meals);
    this.formSubscription = this.formService.form.subscribe((form) => this.form = form);
    this.formService.setForAfterForm();
  }

  onRangeChange({ name, number }) {
    this.formService.updateFormItem(name, number);
    this[name] = number;
  }

  onTimeDateChange({ type, value }) {
    this.formService.updateFormItem(type, value);
  }

  onDescriptionChange({ value }) {
    this.formService.updateFormItem('mealDescription', value);
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

      this.adjustedBeforeEmotions = {...formattedEmotions};
      this.adjustedBeforeFoods = {...formattedFoods};
      this.setFormToAttachedMeal({...formattedEmotions}, {...formattedFoods});
    }).catch(console.error);
  }

  openBeforeLogAddOrEdit() {
    this.modalService.presentModal(
      AddAdjustBeforeFormPage,
      {
        log: this.form,
        emotions: this.adjustedBeforeEmotions,
        foods: this.adjustedBeforeFoods,
        formType: 'meal',
        submit: this.submitLogEdits.bind(this)
      });
  }

  setFormToAttachedMeal(emotions, foods) {
    const {
      mealTime,
      mealDate,
      mealType,
      hungerLevelBefore,
      intensityLevel,
      triggerDescription
    } = this.attachedMeal;

    this.formService.updateFormItems({
      intensityLevel,
      hungerLevelBefore,
      date: mealDate,
      time: mealTime,
      mealType,
      triggerDescription,
    });
  }

  submitLogEdits(log) {
    const {
      intensityLevel,
      hungerLevelBefore,
      date,
      time,
      mealType,
      triggerDescription,
      emotions,
      foods
    } = log;

    this.adjustedBeforeEmotions = emotions;
    this.adjustedBeforeFoods = foods;

    this.formService.updateFormItems({
      intensityLevel,
      hungerLevelBefore,
      date,
      time,
      mealType,
      triggerDescription,
    });
  }

  clearLogEdits() {
    //have to do this here or triggers on change check error
    const newDate = new Date();
    const date = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    const time = this.datePipe.transform(newDate, 'HH:mm');

    this.formService.updateFormItems({
      intensityLevel: 1,
      hungerLevelBefore:  1,
      date: date,
      time: time,
      mealType: '',
      triggerDescription: '',
    });

    this.adjustedBeforeFoods = {};
    this.adjustedBeforeEmotions = {};
    this.formService.clearBeforeForm();
  }

  submitForm() {
    if (this.isMealAttached) this.submitUpdateForm()
    else this.submitNewForm();
  }

  submitNewForm() {
    return this.formService.submitNewAfterMealForm()
    .then(() => this.dismissForm())
    .catch(console.error);

  }

  submitUpdateForm() {
    const { id } = this.attachedMeal;
    const beforeEmotions = this.mealsService.formatMealItemsToCheckboxObject(this.attachedMeal.beforeEmotions);
    const beforeFoods = this.mealsService.formatMealItemsToCheckboxObject(this.attachedMeal.beforeFoods);

    return this.formService.submitAttachedMealAfterForm(id, beforeEmotions, beforeFoods)
    .then(() => this.dismissForm())
    .catch(console.error);
  }

  ngOnDestroy() {
    this.emotionsSubscription.unsubscribe();
    this.foodsSubscription.unsubscribe();
    this.distractionsSubscription.unsubscribe();
    this.formSubscription.unsubscribe();

    this.formService.clearAfterForm();
  }
}
