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

@NgModule({
	declarations: [
    ModalComponent,
    RangeComponent,
    AlertComponent,
    CheckboxListComponent,
    DateTimeComponent,
    DetailTextareaComponent,
    CheckboxTriggerComponent
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
    CheckboxTriggerComponent
  ]
})
export class ComponentsModule {}
