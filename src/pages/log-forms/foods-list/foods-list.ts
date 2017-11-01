import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FoodsProvider } from '../../../providers/food';
import { AlertProvider } from '../../../providers/alert';
import { FormProvider } from '../../../providers/form';


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

  constructor(public navCtrl: NavController, public foodsProvider: FoodsProvider, public navParams: NavParams, public formProvider: FormProvider, public alertProvider: AlertProvider) {
  }

  ngOnInit() {
    this.mealType = this.navParams.get('mealType');
    this.foodsSubscription = this.foodsProvider.foodsList.subscribe(foods => this.foods = foods);
    this.selectedFoodsSubscription = this.formProvider[`selected${this.mealType}Foods`].subscribe(foods => this.selectedFoods = foods);
  }

  toggleFood({ id, name }) {
    if (this.selectedFoods[id]) {
      delete this.selectedFoods[id];
    } else {
      this.selectedFoods[id] = name;
    }
  }

  addNewFood(name) {
    if (name.length < 1) return;

    this.formProvider.addNewFood(name)
    .then((data: any) => {
      this.selectedFoods[data.id] = data.name;
    })
    .catch(console.error);
  }

  triggerFoodPrompt() {
    this.alertProvider.presentPrompt({
      title: 'New Food',
      inputs: [{ name: 'emotion', placeholder: 'Food' }],
      submitHandler: this.addNewFood.bind(this),
    })
  }

  ngOnDestroy() {
    this.foodsSubscription.unsubscribe();
    this.selectedFoodsSubscription.unsubscribe();
  }

  dismiss() {
    this.formProvider.updateFoods(this.selectedFoods, this.mealType);
    this.navCtrl.pop();
  }

}
