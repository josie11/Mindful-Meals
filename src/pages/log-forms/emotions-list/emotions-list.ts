import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { EmotionsService } from '../../../providers/emotion.service';
import { AlertService } from '../../../providers/alert.service';
import { FormService } from '../../../providers/form.service';


@Component({
  selector: 'emotions-list',
  template: `
    <modal>
      <checkbox-list
        title="Emotions"
        (dismiss)="dismiss($event)"
        (triggerPrompt)="triggerEmotionPrompt($event)"
        (toggleCheckbox)="toggleEmotion($event)"
        [items]="emotions"
        [selectedItems]="selectedEmotions"
      >
      </checkbox-list>
    </modal>
  `
})
export class EmotionsListPage implements OnDestroy, OnInit {

  emotions: Array<object> = [];
  emotionsSubscription;
  selectedEmotionsSubscription;
  selectedEmotions = {};
  mealType: string;

  constructor(public emotionsService: EmotionsService, public navParams: NavParams, public formService: FormService, public alertService: AlertService) {
  }

  ngOnInit() {
    this.mealType = this.navParams.get('mealType');
    this.emotionsSubscription = this.emotionsService.emotionsList.subscribe(emotions => this.emotions = emotions);
    this.selectedEmotionsSubscription = this.formService[`selected${this.mealType}Emotions`].subscribe(emotions => this.selectedEmotions = {...emotions});
  }

  toggleEmotion({ id, name }) {
    if (this.selectedEmotions[id]) {
      delete this.selectedEmotions[id];
    } else {
      this.selectedEmotions[id] = name;
    }
  }

  addNewEmotion({ emotion }) {
    if (emotion.length < 1) return;

    this.formService.addNewEmotion(emotion)
    .then((data: any) => {
      this.selectedEmotions[data.id] = data.name;
    })
    .catch(console.error);
  }

  triggerEmotionPrompt() {
    this.alertService.presentPrompt({
      title: 'New Emotion',
      inputs: [{ name: 'emotion', placeholder: 'Emotion' }],
      submitHandler: this.addNewEmotion.bind(this),
    })
  }

  ngOnDestroy() {
    this.emotionsSubscription.unsubscribe();
    this.selectedEmotionsSubscription.unsubscribe();
  }

  dismiss() {
    if (this.mealType === 'Before') this.formService.updateBeforeEmotions(this.selectedEmotions);
    if (this.mealType === 'After') this.formService.updateAfterEmotions(this.selectedEmotions);
  }

}
