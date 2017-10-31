import { Component, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() {
  }

  toggle(id, name) {
    this.toggleCheckbox.emit({id, name});
  }

  done() {
    this.dismiss.emit();
  }

  openPrompt() {
    this.triggerPrompt.emit();
  }
}
