import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }  from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite, SQLiteDatabaseConfig, /*SQLiteObject*/ } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

import { MyApp } from './app.component';
import { ComponentsModule } from '../components/components.module';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { LogHomePage } from '../pages/log-home/log-home';
import { TabsPage } from '../pages/tabs/tabs';
import { BeforeFormPage } from '../pages/log-forms/before-form/before-form';
import { AfterFormPage } from '../pages/log-forms/after-form/after-form';
import { EmotionsListPage } from '../pages/log-forms/emotions-list/emotions-list';
import { FoodCravingsListPage } from '../pages/log-forms/foods-list/foods-list';
import { DistractionsListPage } from '../pages/log-forms/distractions-list/distractions-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';

import { ProvidersModule } from '../providers/providers.module';

import { PipesModule } from '../pipes/pipes.module';

declare var SQL;

class SQLiteObject{
    _objectInstance: any;

    constructor(_objectInstance: any){
      this._objectInstance = _objectInstance;
    };

    executeSql(statement: string, params: any): Promise<any>{

      return new Promise((resolve,reject)=>{
        try {
          console.log(statement)
          var st = this._objectInstance.prepare(statement,params);
          var rows :Array<any> = [] ;
          while(st.step()) {
            var row = st.getAsObject();
            rows.push(row);
          }
          var payload = {
            rows: {
              item: function(i) {
                return rows[i];
              },
              length: rows.length
            },
            rowsAffected: this._objectInstance.getRowsModified() || 0,
            insertId: this._objectInstance.insertId || void 0
          };
          //save database after each sql query

          var arr : ArrayBuffer = this._objectInstance.export();
          localStorage.setItem("database",String(arr));
          resolve(payload);
        } catch(e){
          reject(e);
        }
      });
    };

    batchSql(statements: string[], params: any): Promise<any>{
      return new Promise((resolve,reject)=>{
        try {
          var rows :Array<any> = [];
          for (let statement of statements) {
            console.log(statement)
            var st = this._objectInstance.prepare(statement,params);
            while(st.step()) {
                var row = st.getAsObject();
                rows.push(row);
            }
          }
          var payload = {
            rows: {
              item: function(i) {
                return rows[i];
              },
              length: rows.length
            },
            rowsAffected: this._objectInstance.getRowsModified(),
            insertId: this._objectInstance.insertId || void 0
          };
          //save database after each sql query

          var arr : ArrayBuffer = this._objectInstance.export();
          localStorage.setItem("database",String(arr));
          resolve(payload);
        } catch(e){
          reject(e);
        }
      });
    };
}

class SQLitePorterMock {
    /**
     * Trims leading and trailing whitespace from a string
     * @param {string} str - untrimmed string
     * @returns {string} trimmed string
     */


    trimWhitespace(str){
      return str.replace(/^\s+/,"").replace(/\s+$/,"");
    }

    importSqlToDb(db, sql, opts = {}){
      try {
        const statementRegEx = /(?!\s|;|$)(?:[^;"']*(?:"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*')?)*/g;
        var statements = sql
          .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm,"") // strip out comments
          .match(statementRegEx);

        if(statements === null || (Array.isArray && !Array.isArray(statements))) statements = [];

        // Strip empty statements
        for(var i = 0; i < statements.length; i++){
          if(!statements[i]){
              delete statements[i];
          }
        }
        return db.batchSql(statements)
      } catch(e) {
        console.error(e.message);
      }
    }
}

class SQLiteMock {

  public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
    var db;
    var storeddb = localStorage.getItem("database");

    if(storeddb) {
      var arr = storeddb.split(',');
      db = new SQL.Database(arr);
    }
    else {
       db = new SQL.Database();
    }

    return new Promise((resolve,reject)=>{
      resolve(new SQLiteObject(db));
    });
  }
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    BeforeFormPage,
    ContactPage,
    LogHomePage,
    TabsPage,
    EmotionsListPage,
    FoodCravingsListPage,
    AfterFormPage,
    DistractionsListPage
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
    AboutPage,
    ContactPage,
    LogHomePage,
    TabsPage,
    BeforeFormPage,
    EmotionsListPage,
    FoodCravingsListPage,
    AfterFormPage,
    DistractionsListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: SQLite, useClass: SQLiteMock},
    {provide: SQLitePorter, useClass: SQLitePorterMock },
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
