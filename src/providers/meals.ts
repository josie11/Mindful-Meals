import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DatabaseProvider } from './database';
import 'rxjs/add/operator/map';

/*
  Generated class for the MealsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MealsProvider {

  constructor(public http: Http, private databaseProvider: DatabaseProvider) {
    console.log('Hello MealsProvider Provider');
  }

}
