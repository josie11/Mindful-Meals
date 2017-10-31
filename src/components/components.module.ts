import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PipesModule } from '../pipes/pipes.module';
import { ModalComponent } from './modal/modal';
import { RangeComponent } from './form-inputs/range/range';
import { AlertComponent } from './alert/alert';
import { CheckboxListComponent } from './lists/checkbox-list/checkbox-list';

@NgModule({
	declarations: [
    ModalComponent,
    RangeComponent,
    AlertComponent,
    CheckboxListComponent
  ],
	imports: [
    IonicModule,
    PipesModule
  ],
	exports: [
    ModalComponent,
    RangeComponent,
    AlertComponent,
    CheckboxListComponent
  ]
})
export class ComponentsModule {}
