import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'checkbox-list',
  templateUrl: 'checkbox-list.html',
})
export class CheckboxListComponent {
  @Input() title: string;
  @Input() items: object[];
  @Input() selectedItems: object;

  @Output() toggleCheckbox: EventEmitter<object> = new EventEmitter();
  @Output() dismiss: EventEmitter<object> = new EventEmitter();
  @Output() triggerPrompt: EventEmitter<object> = new EventEmitter();

  constructor(public navCtrl: NavController) {
  }

  toggle(id, name) {
    this.toggleCheckbox.emit({id, name});
  }

  submit() {
    this.dismiss.emit();
    this.close();
  }

  close() {
    this.navCtrl.pop();
  }

  openPrompt() {
    this.triggerPrompt.emit();
  }
}
