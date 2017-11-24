import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppSetupService } from '../providers/app-setup.service';
import { TabsPage } from '../pages/tabs/tabs';

/*
  current version of mindful meals
*/
const appVersion: number = 1;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, appSetupService: AppSetupService) {

    platform.ready().then(() => {
      appSetupService.initializeApp(appVersion);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
