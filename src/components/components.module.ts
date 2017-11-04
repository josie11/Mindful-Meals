import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PipesModule } from '../pipes/pipes.module';
import { ModalComponent } from './modal/modal';
import { RangeComponent } from './form-inputs/range/range';
import { AlertComponent } from './alert/alert';
import { CheckboxListComponent } from './lists/checkbox-list/checkbox-list';
import { DateTimeComponent } from './form-inputs/date-time/date-time';
import { DetailTextareaComponent } from './form-inputs/detail-textarea/detail-textarea';
import { CheckboxTriggerComponent } from './form-inputs/checkbox-trigger/checkbox-trigger';
import { BeforeFormContentComponent } from './forms/before-form-content/before-form-content';

@NgModule({
	declarations: [
    ModalComponent,
    RangeComponent,
    AlertComponent,
    CheckboxListComponent,
    DateTimeComponent,
    DetailTextareaComponent,
    CheckboxTriggerComponent,
    BeforeFormContentComponent
  ],
	imports: [
    IonicModule,
    PipesModule
  ],
	exports: [
    ModalComponent,
    RangeComponent,
    AlertComponent,
    CheckboxListComponent,
    DateTimeComponent,
    DetailTextareaComponent,
    CheckboxTriggerComponent,
    BeforeFormContentComponent
  ]
})
export class ComponentsModule {}
