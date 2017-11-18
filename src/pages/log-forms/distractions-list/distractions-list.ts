import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { DistractionsService } from '../../../providers/distraction.service';
import { AlertService } from '../../../providers/alert.service';
import { FormService } from '../../../providers/form.service';


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

  constructor(public distractionsService: DistractionsService, public navParams: NavParams, public formService: FormService, public alertService: AlertService) {
  }

  ngOnInit() {
    this.distractionsSubscription = this.distractionsService.distractionsList.subscribe(distractions => this.distractions = distractions);
    this.selectedDistractionsSubscription = this.formService.selectedDistractions.subscribe(distractions => {
      this.selectedDistractions = {...distractions};
    });
  }

  toggleDistraction({ id, name }) {
    if (this.selectedDistractions[id]) {
      delete this.selectedDistractions[id];
    } else {
      this.selectedDistractions[id] = name;
    }
  }

  addNewDistraction({ distraction }) {
    if (distraction.length < 1) return;

    this.formService.addNewDistraction(distraction)
    .then((data: any) => {
      this.selectedDistractions[data.id] = data.name;
    });
  }

  triggerDistractionPrompt() {
    this.alertService.presentPrompt({
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
    this.formService.updateDistractions(this.selectedDistractions);
  }

}
