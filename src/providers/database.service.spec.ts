import { TestBed, inject, fakeAsync, flushMicrotasks, async } from '@angular/core/testing';
import { ProvidersModule } from './providers.module';
import { Platform } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLitePorterMock, SQLiteMock, SQLiteObject } from '../common/mocks';
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

    localStorage.setItem("database", null);
    databaseService = TestBed.get(DatabaseService);
    databaseService.initializeDatabase('testDb')
    .then(() => {
      return databaseService.database.executeSql(
      `CREATE TABLE IF NOT EXISTS emotions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        name CHAR(50));`, {});
    });
  }));

  it('database should be created and open', () => {
    expect(databaseService.database instanceof SQLiteObject).toEqual(true);
    expect(databaseService.database).toBeDefined();
  });

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

  it('createSqlDeleteStatement should format a sql statement for delete', () => {
    const dbName = 'db';
    const extraStatement = 'WHERE id = 1'
    const sql = databaseService.createSqlDeleteStatement(dbName, extraStatement);

    expect(sql).toEqual("DELETE FROM db WHERE id = 1;");
  });

  it('processSqlResults should process results from database into an array based on # of rows' , () => {
    const itemFunc = (i) => {
      const results = ['item1', 'item2'];
      return results[i];
    };

    const data = {
      rows: {
        item: itemFunc,
        length: 2
      }
    }

    const results = databaseService.processSqlResults(data);

    expect(results).toEqual(['item1', 'item2']);
  });

  it('can insert an item into the database and return the id of the created item. Can select item from database.', fakeAsync(() => {
    let insert: any;
    let result: any;

    const dbName = 'emotions';
    const item = { name: 'Sad' }

    databaseService.insert({ dbName, item }).then((data: any) => insert = data);

    flushMicrotasks();

    expect(insert.id).toBeDefined();
    expect(insert.id).toMatch(/\d+/);

    databaseService.select({
      dbName,
      selection: '*',
      extraStatement: `WHERE id = ${insert.id}`
    }).then((data: any) => result = data[0]);

    flushMicrotasks();

    expect(result.id).toEqual(insert.id);
    expect(result.name).toEqual(item.name);
  }));

  it('can insert multiple items into database', fakeAsync(() => {
    let results;

    const dbName = 'emotions'
    const items = [
      { name: 'Sad' },
      { name: 'Happy' }
    ];

    databaseService.bulkInsert({ items, dbName })
    .then(() => databaseService.select({ dbName, selection: '*', extraStatement: "WHERE name = 'Sad' OR name = 'Happy'" }))
    .then((data: any) => results = [data[0].name, data[1].name]);

    flushMicrotasks();

    expect(results).toContain('Sad');
    expect(results).toContain('Happy');
  }));
});
