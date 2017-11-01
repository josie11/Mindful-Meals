import { NgModule } from '@angular/core';
import { DatabaseProvider } from './database';
import { MealsProvider } from './meals';
import { ModalProvider } from './modal';
import { EmotionsProvider } from './emotion';
import { AlertProvider } from './alert';
import { FormProvider } from './form';
import { FoodsProvider } from './food';
import { DistractionsProvider } from './distraction';

@NgModule({
  imports: [],
  providers: [
    AlertProvider,
    FormProvider,
    EmotionsProvider,
    DatabaseProvider,
    MealsProvider,
    ModalProvider,
    FoodsProvider,
    DistractionsProvider
   ],
  exports: []
})
export class ProvidersModule {}
