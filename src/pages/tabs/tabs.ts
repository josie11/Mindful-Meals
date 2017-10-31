import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { LogHomePage } from '../log-home/log-home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LogHomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
