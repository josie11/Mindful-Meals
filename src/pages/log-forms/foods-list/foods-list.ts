import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FoodsProvider } from '../../../providers/food';
import { AlertProvider } from '../../../providers/alert';
import { BeforeFormProvider } from '../../../providers/before-form';


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

  constructor(public navCtrl: NavController, public foodsProvider: FoodsProvider, public navParams: NavParams, public bfProvider: BeforeFormProvider, public alertProvider: AlertProvider) {
  }

  ngOnInit() {
    this.foodsSubscription = this.foodsProvider.foodsList.subscribe(foods => this.foods = foods);
    this.selectedFoodsSubscription = this.bfProvider.selectedFoods.subscribe(foods => this.selectedFoods = foods);
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

    this.bfProvider.addNewFood(name)
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
    this.bfProvider.updateFoods(this.selectedFoods);
    this.navCtrl.pop();
  }

}
