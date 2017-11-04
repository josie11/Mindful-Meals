import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EmotionsProvider } from '../../../providers/emotion';
import { AlertProvider } from '../../../providers/alert';
import { FormProvider } from '../../../providers/form';


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

  constructor(public navCtrl: NavController, public emotionsProvider: EmotionsProvider, public navParams: NavParams, public formProvider: FormProvider, public alertProvider: AlertProvider) {
  }

  ngOnInit() {
    this.mealType = this.navParams.get('mealType');
    this.emotionsSubscription = this.emotionsProvider.emotionsList.subscribe(emotions => this.emotions = emotions);
    this.selectedEmotionsSubscription = this.formProvider[`selected${this.mealType}Emotions`].subscribe(emotions => {
      this.selectedEmotions = emotions;
    });
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

    this.formProvider.addNewEmotion(emotion)
    .then((data: any) => {
      this.selectedEmotions[data.id] = data.name;
    })
    .catch(console.error);
  }

  triggerEmotionPrompt() {
    this.alertProvider.presentPrompt({
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
    if (this.mealType === 'Before') this.formProvider.updateBeforeEmotions(this.selectedEmotions);
    if (this.mealType === 'After') this.formProvider.updateAfterEmotions(this.selectedEmotions);
    this.navCtrl.pop();
  }

}
