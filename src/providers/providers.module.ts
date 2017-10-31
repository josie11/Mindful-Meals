import { NgModule } from '@angular/core';
import { DatabaseProvider } from './database';
import { MealsProvider } from './meals';
import { ModalProvider } from './modal';
import { EmotionsProvider } from './emotion';
import { AlertProvider } from './alert';
import { BeforeFormProvider } from './before-form';
import { FoodsProvider } from './food';

@NgModule({
  imports: [],
  providers: [
    AlertProvider,
    BeforeFormProvider,
    EmotionsProvider,
    DatabaseProvider,
    MealsProvider,
    ModalProvider,
    FoodsProvider
   ],
  exports: []
})
export class ProvidersModule {}
