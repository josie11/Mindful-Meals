import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DistractionsProvider } from '../../../providers/distraction';
import { AlertProvider } from '../../../providers/alert';
import { FormProvider } from '../../../providers/form';


@Component({
  selector: 'distractions-list',
  template: `
    <modal>
      <checkbox-list
        title="Distractions"
        (dismiss)="dismiss($event)"
        (triggerPrompt)="triggerDistractionPrompt($event)"
        (toggleCheckbox)="toggleDistraction($event)"
        [items]="distractions"
        [selectedItems]="selectedDistractions"
      >
      </checkbox-list>
    </modal>
  `
})
export class DistractionsListPage implements OnDestroy, OnInit {

  distractions: Array<object> = [];
  distractionsSubscription;
  selectedDistractionsSubscription;
  selectedDistractions = {};

  constructor(public navCtrl: NavController, public distractionsProvider: DistractionsProvider, public navParams: NavParams, public formProvider: FormProvider, public alertProvider: AlertProvider) {
  }

  ngOnInit() {
    this.distractionsSubscription = this.distractionsProvider.distractionsList.subscribe(distractions => this.distractions = distractions);
    this.selectedDistractionsSubscription = this.formProvider.selectedDistractions.subscribe(distractions => {
      this.selectedDistractions = distractions;
    });
  }

  toggleDistraction({ id, name }) {
    if (this.selectedDistractions[id]) {
      delete this.selectedDistractions[id];
    } else {
      this.selectedDistractions[id] = name;
    }
  }

  addNewDistraction(name) {
    if (name.length < 1) return;

    this.formProvider.addNewDistraction(name)
    .then((data: any) => {
      this.selectedDistractions[data.id] = data.name;
    })
    .catch(console.error);
  }

  triggerDistractionPrompt() {
    this.alertProvider.presentPrompt({
      title: 'New Distraction',
      inputs: [{ name: 'distraction', placeholder: 'Distraction' }],
      submitHandler: this.addNewDistraction.bind(this),
    })
  }

  ngOnDestroy() {
    this.distractionsSubscription.unsubscribe();
    this.selectedDistractionsSubscription.unsubscribe();
  }

  dismiss() {
    this.formProvider.updateDistractions(this.selectedDistractions);
    this.navCtrl.pop();
  }

}
