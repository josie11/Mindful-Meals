import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PipesModule } from '../pipes/pipes.module';
import { ModalComponent } from './modal/modal';
import { RangeComponent } from './form-inputs/range/range';
import { CheckboxListComponent } from './lists/checkbox-list/checkbox-list';
import { DateTimeComponent } from './form-inputs/date-time/date-time';
import { DetailTextareaComponent } from './form-inputs/detail-textarea/detail-textarea';
import { CheckboxTriggerComponent } from './form-inputs/checkbox-trigger/checkbox-trigger';
import { BeforeFormContentComponent } from './forms/before-form-content/before-form-content';
import { AfterFormContentComponent } from './forms/after-form-content/after-form-content';
import { ProgressCirclesComponent } from './log-view/progress-circles/progress-circles';
import { RoundProgressModule } from './round-progress/index';
import { DateSwitchDividerComponent } from './log-view/date-switch-divider/date-switch-divider';
import { LogViewSectionComponent } from './log-view/log-view-section/log-view-section';

@NgModule({
	declarations: [
    ModalComponent,
    RangeComponent,
    CheckboxListComponent,
    DateTimeComponent,
    DetailTextareaComponent,
    CheckboxTriggerComponent,
    BeforeFormContentComponent,
    ProgressCirclesComponent,
    DateSwitchDividerComponent,
    LogViewSectionComponent,
    AfterFormContentComponent
  ],
	imports: [
    IonicModule,
    PipesModule,
    RoundProgressModule
  ],
	exports: [
    ModalComponent,
    RangeComponent,
    CheckboxListComponent,
    DateTimeComponent,
    DetailTextareaComponent,
    CheckboxTriggerComponent,
    BeforeFormContentComponent,
    ProgressCirclesComponent,
    DateSwitchDividerComponent,
    LogViewSectionComponent,
    AfterFormContentComponent
  ],
  providers: [
  ]
})
export class ComponentsModule {}
