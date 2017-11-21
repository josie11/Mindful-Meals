import { TestBed, inject, fakeAsync, flushMicrotasks, async } from '@angular/core/testing';
import { ProvidersModule } from './providers.module';
import { Platform } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLitePorterMock, SQLiteMock } from '../common/mocks';
import { PlatformMock } from '../mocks';
import { IonicStorageModule } from '@ionic/storage';

import { DatabaseService } from './database.service';

describe('DatabaseService', () => {

  let databaseService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ProvidersModule, IonicStorageModule, IonicStorageModule.forRoot()],
      providers: [
        DatabaseService,
        {provide: SQLite, useClass: SQLiteMock},
        {provide: SQLitePorter, useClass: SQLitePorterMock },
        {provide: Platform, useClass: PlatformMock },
      ]
    });

    databaseService = TestBed.get(DatabaseService);
    databaseService.initializeDatabase('testDb');
  }));

  it('database should be created with all tables after initialization', fakeAsync(() => {
    let results;

    databaseService.select(({selection: 'name', dbName: 'sqlite_master', extraStatement: "WHERE type='table'"}))
    .then((data) => results = data.map(({name}) => name))

    flushMicrotasks();
    expect(results.length).toBe(11);
    expect(results).toContain('meals');
    expect(results).toContain('cravings');
    expect(results).toContain('emotions');
    expect(results).toContain('distractions');
    expect(results).toContain('foods');
    expect(results).toContain('cravingEmotions');
    expect(results).toContain('cravingFoods');
    expect(results).toContain('mealEmotions');
    expect(results).toContain('mealFoods');
    expect(results).toContain('mealDistractions');
  }));

  it('formatDataforInsert takes an object of key/value pairs and returns an object with cols/values arrays', () => {
    const object = {
      id: 1,
      name: 'food'
    };
    const { cols, values } = databaseService.formatDataforInsert(object);

    expect(cols).toEqual(['id', 'name']);
    expect(values).toEqual([1, 'food']);
  });

  it('formatSqlValue should format a value as a number or string', () => {
    const number = databaseService.formatSqlValue(1);
    const string = databaseService.formatSqlValue('string');
    const numberString = databaseService.formatSqlValue('1');

    expect(number).toBe(1);
    expect(string).toBe("'string'");
    expect(numberString).toBe("'1'");
  });

  it('createSqlInsertStatement should format a sql statement for insert', () => {
    const cols = ['name']
    const values = ['Depressed'];
    const dbName = 'emotions';
    const sql = databaseService.createSqlInsertStatement(cols, values, dbName);

    expect(sql).toEqual("INSERT INTO emotions (name) VALUES ('Depressed');");
  });

  it('createSqlSelectStatement should format a sql statement for select', () => {
    const selection = '*'
    const dbName = 'db';
    const extraStatement = 'WHERE id = 1';
    const sql = databaseService.createSqlSelectStatement(selection, dbName, extraStatement);

    expect(sql).toEqual("SELECT * FROM db WHERE id = 1;");
  });

  it('formatDataForUpdate takes an object of key/value pairs and returns an array of objects', () => {
    const object = {
      type: 'type',
      name: 'name'
    };
    const values = databaseService.formatDataForUpdate(object);

    expect(values).toEqual([{ col: 'type', value: 'type'}, { col: 'name', value: 'name'}]);
  });

  it('createSqlUpdateStatement should format a sql statement for update', () => {
    const id = '1'
    const dbName = 'db';
    const values = [{ col: 'name', value: 'name'}, { col: 'type', value: 'type'}];
    const sql = databaseService.createSqlUpdateStatement(values, id, dbName);

    expect(sql).toEqual("UPDATE db SET name = 'name', type = 'type' WHERE id = 1;");
  });
});
