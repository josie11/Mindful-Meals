
import { TestBed, inject } from '@angular/core/testing';

import { ProvidersModule } from './providers.module';
import { HttpModule } from '@angular/http';
import { Platform, IonicModule } from 'ionic-angular';
import { SQLite, SQLiteDatabaseConfig, /*SQLiteObject*/ } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { IonicStorageModule } from '@ionic/storage';

import { FormService } from './form.service';

describe('ChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProvidersModule, HttpModule, IonicStorageModule, IonicStorageModule.forRoot()],
      providers: [FormService, Platform, SQLite, SQLitePorter]
    });
  });

  it('should be created', inject([FormService], (service: FormService) => {
    expect(service).toBeTruthy();
  }));
});
