import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { TimePipe } from '../../../pipes/time/time';
import { AlertService } from '../../../providers/alert.service';
import { ModalService } from '../../../providers/modal.service';
import { FormService } from '../../../providers/form.service';
import { MealsService } from '../../../providers/meals.service';
import { AddAdjustBeforeFormPage } from '../add-adjust-before-form/add-adjust-before-form';

import {
  FormObject,
  Meal,
} from '../../../common/types';

/**
 * Generated class for the AfterFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'after-form',
  templateUrl: 'after-form.html',
  providers: [DatePipe, TimePipe]
})
export class AfterFormPage implements OnDestroy, OnInit {

  distractions: object = {};
  emotions: object = {};
  foods: object = {};

  beforeEmotionsEdits: object = {};
  beforeFoodsEdits: object = {}

  form: any = {};

  incompleteMeals: Partial<Meal>[] = [];
  attachedMeal: any = {};
  isMealAttached: boolean = false;

  toggle: boolean = false;

  //have to do this to prevent expression changed after check error
  date: string;
  time: string;

  afterEmotionsSubscription;
  afterFoodsSubscription;
  distractionsSubscription;
  formSubscription;

  constructor(
    private navCtrl: NavController,
    private modalService: ModalService,
    private alertService: AlertService,
    private formService: FormService,
    private mealsService: MealsService,
    private datePipe: DatePipe,
    private timePipe: TimePipe,
  ) {
  }

  ngOnInit() {
    this.afterEmotionsSubscription = this.formService.selectedAfterEmotions.subscribe(emotions => this.emotions = emotions);
    this.afterFoodsSubscription = this.formService.selectedAfterFoods.subscribe(foods => this.foods = foods);

    this.distractionsSubscription = this.formService.selectedDistractions.subscribe(distractions => this.distractions = distractions);

    this.formSubscription = this.formService.form.subscribe((form: FormObject) => this.form = {...form});

    this.mealsService.getIncompleteMeals().then((meals: Partial<Meal>[]) => this.incompleteMeals = meals);
    this.formService.setForAfterForm();
  }

  onTimeDateChange({ type, value }) {
    this.formService.updateFormItem(type, value);
  }

  onMealTypeChange(value) {
    this.formService.updateFormItem('mealType', value);
  }

  /**
   * Passed to before/after form content components for adjusting form in form service
  */

  onFormItemChange({ item, value}) {
    this.formService.updateFormItem(item, value);
  }

  /**
   * Controls process of attaching a meal/unattaching a meal
   * If a meal is not attached, a prompt will appear giving the user the option to attach a meal
   * Otherwise, the user is untoggling an attached meal and it removes the attached meal,
   * and clears any log edits.
  */
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

  /**
   * Presents the prompt populated with incomplete meal logs (before meal logs)
   * A user can select on to attach as before meal data for the after meal log
   */
  presentBeforeMealPrompt() {
    const options = this.incompleteMeals.map((meal: Partial<Meal>) => {
        const date = this.datePipe.transform(`${meal.mealDate}T${meal.mealTime}`, ' MMM d, y');
        const time = this.timePipe.transform(`${meal.mealDate}T${meal.mealTime}`);
        return {
          value: meal.id,
          label: `${date} ${time}`,
          checked: false,
          type: 'radio'
        }
    });

    if (options.length > 0) {
      this.alertService.presentRadio({
        title: 'Incomplete Meal Logs',
        inputs: options,
        submitHandler: this.linkWithExistingMeal.bind(this)
      })
    } else {
      this.alertService.presentAlert({
        title: 'Incomplete Meal Logs',
        subTitle: 'No Incomplete Meal Logs'
      })
    }
  }

  /**
   * Processes the before meal log the user and attaches it to the after meal log.
   * updates the form in the formService to include the attached meal data.
  */
  linkWithExistingMeal(id) {
    if (id == this.attachedMeal['id']) return;
    return this.mealsService.getMeal(id).then((meal: Meal) => {
      const formattedEmotions = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeEmotions);
      const formattedFoods = this.mealsService.formatMealItemsToCheckboxObject(meal.beforeFoods);

      this.attachedMeal = meal
      this.isMealAttached = true;

      //We need to keep track of this to hold onto to repeated meal log edits
      //that haven't been submitted. DO NOT REMOVE
      this.beforeEmotionsEdits = formattedEmotions;
      this.beforeFoodsEdits = formattedFoods;

      this.setFormToAttachedMeal({...formattedEmotions}, {...formattedFoods});
    })
  }

  /**
   * Presents Modal that allows us to edit either an attached before meal log,
   * or an empty before meal log
  */
  openBeforeLogAddOrEdit() {
    this.modalService.presentModal(
      AddAdjustBeforeFormPage,
      {
        log: this.form,
        emotions: this.beforeEmotionsEdits,
        foods: this.beforeFoodsEdits,
        formType: 'meal',
        submit: this.submitLogEdits.bind(this),
        cancel: this.cancelLogEdits.bind(this)
      });
  }

  /**
   * Updates the form in the form service with an attached before meal log.
  */
  setFormToAttachedMeal(emotions, foods) {
    this.formService.updateFormToBeforeMeal(this.attachedMeal, emotions, foods);
  }

  /**
   * Fires when user cancels edits in AddAdjustBeforeFormPage
   * As a user is editing a before log via the AddAdjustBeforeFormPage
   * the edits are changing before emotions/foods in the form service
   * when they hit cancel - this will revert the form service before emotion/foods back to
   * the values that existed prior to edits in AddAdjustBeforeFormPage
   * I don't like this, but i'd have to rewrite a bunch of stuff in order to change this....
  */
  cancelLogEdits() {
    this.formService.updateBeforeEmotions(this.beforeEmotionsEdits);
    this.formService.updateBeforeFoods(this.beforeFoodsEdits);
  }

  /**
   * Fires when a user submits edits in the AddAdjustBeforeFormPage
   * will update form service form object with the edits.
   * form service before emotions/foods have already been updated via the before-form-content component
   * we store the last edits for foods/emotions in case of edit cancellations (see above cancelLogEdits)
  */
  submitLogEdits(log: Partial<FormObject>) {
    const {
      intensityLevel,
      hungerLevelBefore,
      date,
      time,
      mealType,
      triggerDescription,
    } = log;

    // we need to store a copy of last item edits (before food/ before emotions) in case they go to edit
    // and make changes to these items, and click cancel - because the process
    // of editing these items is adjusting the forms directly in form service, so we need to be able to revert this on cancel
    // see cancelLogEdits function
    const updatedBeforeEmotions = {...this.formService.selectedBeforeEmotions.getValue()};
    const updatedBeforeFoods = {...this.formService.selectedBeforeFoods.getValue()};

    this.formService.updateFormItems({
      intensityLevel,
      hungerLevelBefore,
      date,
      time,
      mealType,
      triggerDescription,
    });

    this.beforeEmotionsEdits = updatedBeforeEmotions;
    this.beforeFoodsEdits = updatedBeforeFoods;
  }

  /**
   * clears form service of before meal log, resets it to defaults.
   * would triggers when needing to remove an attached meal from after log
  */
  clearLogEdits() {
    const newDate = new Date();
    const date = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    const time = this.datePipe.transform(newDate, 'HH:mm:ss');

    //have to do this here or triggers on change check error
    //upon untoggling an attached meal, we need to reset time to current
    this.date = date;
    this.time = time;

    this.formService.refreshFormToBeforeFormDefaults(date, time);

    this.beforeEmotionsEdits = {};
    this.beforeFoodsEdits = {};
    this.formService.clearBeforeForm();
  }

  /**
   * submits after form.
  */
  submitForm() {
    if (this.isMealAttached) this.submitUpdateForm()
    else this.submitNewForm();
  }

  /**
   * If no before meal log is attached, submits after meal log form as a new meal to the database.
  */
  submitNewForm() {
    return this.formService.submitNewAfterMealForm()
    .then(() => this.dismissForm())


  }

  /**
   * If before meal log is attached, submits after meal log as an update to existing meal log.
  */
  submitUpdateForm() {
    const { id } = this.attachedMeal;
    const beforeEmotions = this.mealsService.formatMealItemsToCheckboxObject(this.attachedMeal.beforeEmotions);
    const beforeFoods = this.mealsService.formatMealItemsToCheckboxObject(this.attachedMeal.beforeFoods);

    return this.formService.submitAttachedMealAfterForm(id, beforeEmotions, beforeFoods)
    .then(() => this.dismissForm())

  }

  dismissForm() {
    this.navCtrl.pop();
  }

  ngOnDestroy() {
    this.afterEmotionsSubscription.unsubscribe();
    this.afterFoodsSubscription.unsubscribe();

    this.distractionsSubscription.unsubscribe();

    this.formSubscription.unsubscribe();
    this.formService.clearAfterForm();
  }
}
