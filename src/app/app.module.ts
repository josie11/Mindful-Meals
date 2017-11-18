import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }  from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { MyApp } from './app.component';
import { ComponentsModule } from '../components/components.module';

import { DiaryPage } from '../pages/diary/diary/diary';
import { ContactPage } from '../pages/contact/contact';
import { LogHomePage } from '../pages/log-home/log-home';
import { TabsPage } from '../pages/tabs/tabs';
import { BeforeFormPage } from '../pages/log-forms/before-form/before-form';
import { AfterFormPage } from '../pages/log-forms/after-form/after-form';
import { EmotionsListPage } from '../pages/log-forms/emotions-list/emotions-list';
import { FoodCravingsListPage } from '../pages/log-forms/foods-list/foods-list';
import { DistractionsListPage } from '../pages/log-forms/distractions-list/distractions-list';
import { AddAdjustBeforeFormPage } from '../pages/log-forms/add-adjust-before-form/add-adjust-before-form';
import { MealLogPage } from '../pages/diary/meal-log/meal-log';
import { CravingLogPage } from '../pages/diary/craving-log/craving-log';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';

import { ProvidersModule } from '../providers/providers.module';

import { PipesModule } from '../pipes/pipes.module';

//IMPORTANT: ALLOWS FOR DEVELOPMENT IN THE BROWSER
//MOCKS THE NATIVE STORAGE - SQLITE
// import { SQLitePorterMock, SQLiteMock } from '../common/mocks';

@NgModule({
  declarations: [
    MyApp,
    DiaryPage,
    BeforeFormPage,
    ContactPage,
    LogHomePage,
    TabsPage,
    EmotionsListPage,
    FoodCravingsListPage,
    AfterFormPage,
    DistractionsListPage,
    AddAdjustBeforeFormPage,
    MealLogPage,
    CravingLogPage
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ComponentsModule,
    HttpModule,
    PipesModule,
    ProvidersModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DiaryPage,
    ContactPage,
    LogHomePage,
    TabsPage,
    BeforeFormPage,
    EmotionsListPage,
    FoodCravingsListPage,
    AfterFormPage,
    DistractionsListPage,
    AddAdjustBeforeFormPage,
    MealLogPage,
    CravingLogPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // {provide: SQLite, useClass: SQLiteMock},
    // {provide: SQLitePorter, useClass: SQLitePorterMock },
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    SQLitePorter,
  ]
})
export class AppModule {}
