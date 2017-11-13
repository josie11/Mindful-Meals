import { Component } from '@angular/core';

import { DiaryPage } from '../diary/diary/diary';
import { ContactPage } from '../contact/contact';
import { LogHomePage } from '../log-home/log-home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LogHomePage;
  tab2Root = DiaryPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
