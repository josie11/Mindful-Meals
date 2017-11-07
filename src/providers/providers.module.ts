import { NgModule } from '@angular/core';
import { DatabaseService } from './database.service';
import { MealsService } from './meals.service';
import { ModalService } from './modal.service';
import { EmotionsService } from './emotion.service';
import { AlertService } from './alert.service';
import { FormService } from './form.service';
import { FoodsService } from './food.service';
import { DistractionsService } from './distraction.service';
import { CravingsService } from './craving.service';
import { DiaryService } from './diary.service';

@NgModule({
  imports: [],
  providers: [
    AlertService,
    FormService,
    EmotionsService,
    DatabaseService,
    MealsService,
    ModalService,
    FoodsService,
    DistractionsService,
    CravingsService,
    DiaryService
   ],
  exports: []
})
export class ProvidersModule {}
