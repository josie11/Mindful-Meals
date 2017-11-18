import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { FoodsService } from '../../../providers/food.service';
import { AlertService } from '../../../providers/alert.service';
import { FormService } from '../../../providers/form.service';


@Component({
  selector: 'food-cravings-list',
  template: `
    <modal>
      <checkbox-list
        title="Foods Craved"
        (dismiss)="dismiss($event)"
        (triggerPrompt)="triggerFoodPrompt($event)"
        (toggleCheckbox)="toggleFood($event)"
        [items]="foods"
        [selectedItems]="selectedFoods"
      >
      </checkbox-list>
    </modal>
  `
})
export class FoodCravingsListPage implements OnDestroy, OnInit {

  foods: Array<object> = [];
  foodsSubscription;
  selectedFoodsSubscription;
  selectedFoods = {};
  mealType: string;

  constructor(public foodsService: FoodsService, public navParams: NavParams, public formService: FormService, public alertService: AlertService) {
  }

  ngOnInit() {
    this.mealType = this.navParams.get('mealType');
    this.foodsSubscription = this.foodsService.foodsList.subscribe(foods => this.foods = foods);
    this.selectedFoodsSubscription = this.formService[`selected${this.mealType}Foods`].subscribe(foods => this.selectedFoods = {...foods});
  }

  toggleFood({ id, name }) {
    if (this.selectedFoods[id]) {
      delete this.selectedFoods[id];
    } else {
      this.selectedFoods[id] = name;
    }
  }

  addNewFood({ food }) {
    if (food.length < 1) return;

    this.formService.addNewFood(food)
    .then((data: any) => {
      this.selectedFoods[data.id] = data.name;
    });
  }

  triggerFoodPrompt() {
    this.alertService.presentPrompt({
      title: 'New Food',
      inputs: [{ name: 'food', placeholder: 'Food' }],
      submitHandler: this.addNewFood.bind(this),
    })
  }

  ngOnDestroy() {
    this.foodsSubscription.unsubscribe();
    this.selectedFoodsSubscription.unsubscribe();
  }

  dismiss() {
    if (this.mealType === 'Before') this.formService.updateBeforeFoods(this.selectedFoods);
    if (this.mealType === 'After') this.formService.updateAfterFoods(this.selectedFoods);
  }

}
