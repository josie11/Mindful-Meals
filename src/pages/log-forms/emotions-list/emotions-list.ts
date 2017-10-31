import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EmotionsProvider } from '../../../providers/emotion';
import { AlertProvider } from '../../../providers/alert';
import { BeforeFormProvider } from '../../../providers/before-form';


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

  constructor(public navCtrl: NavController, public emotionsProvider: EmotionsProvider, public navParams: NavParams, public bfProvider: BeforeFormProvider, public alertProvider: AlertProvider) {
  }

  ngOnInit() {
    this.emotionsSubscription = this.emotionsProvider.emotionsList.subscribe(emotions => this.emotions = emotions);
    this.selectedEmotionsSubscription = this.bfProvider.selectedEmotions.subscribe(emotions => {
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

  addNewEmotion(name) {
    if (name.length < 1) return;

    this.bfProvider.addNewEmotion(name)
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
    this.bfProvider.updateEmotions(this.selectedEmotions);
    this.navCtrl.pop();
  }

}
