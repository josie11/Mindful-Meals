import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public databaseProvider: DatabaseProvider) {
    databaseProvider.executeSql('PRAGMA table_info(meals);').then(results => console.log(results))
  }

}
