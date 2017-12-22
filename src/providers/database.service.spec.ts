import { TestBed, inject, fakeAsync, flushMicrotasks, async } from '@angular/core/testing';
import { ProvidersModule } from './providers.module';
import { Platform } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { SQLiteMock, SQLiteObject } from '../common/mocks';
import { PlatformMock } from '../mocks';
import { IonicStorageModule } from '@ionic/storage';

import { DatabaseService } from './database.service';

describe('DatabaseService', () => {

  let databaseService;

  const dbName = 'emotions';

  const exampleEmotion1 = {
    name: 'Sad',
    intensity: 2
  }

  const exampleEmotion2 = {
    name: 'Happy',
    intensity: 10
  }

  const updateValues1 = {
    name: 'Morose',
    intensity: 3
  }


  const updateValues2 = {
    name: 'Ecstatic',
    intensity: 5
  }

  const insertItemToDatabase = (item: object) => {
    return databaseService.insert({ dbName, item })
    .then((data: any) => databaseService.select({
      dbName,
      selection: '*',
      extraStatement: `WHERE id = ${data.id}`
    })
    .then((data: any) => data[0]));
  }

  const insertItemsToDatabase = (items: object[]) => {
    return databaseService.bulkInsert({ dbName, items })
    .then((data: any) => databaseService.select({
      dbName,
      selection: '*',
    })
    .then((data: any) => data));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ProvidersModule, IonicStorageModule, IonicStorageModule.forRoot()],
      providers: [
        DatabaseService,
        {provide: SQLite, useClass: SQLiteMock},
        {provide: Platform, useClass: PlatformMock },
      ]
    });

    databaseService = TestBed.get(DatabaseService);
    databaseService.initializeDatabase('testDb')
    .then(() => {
      return databaseService.database.executeSql(
      `CREATE TABLE IF NOT EXISTS emotions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        name CHAR(50),
        intensity INTEGER
      );`, {});
    });
  }));

  afterEach(async(() => {
    localStorage.setItem("database", null);
  }));

  it('database should be created and open', () => {
    expect(databaseService.database).toBeDefined();
    expect(databaseService.database instanceof SQLiteObject).toEqual(true);
    expect(databaseService.databaseReady.value).toEqual(true);
  });

  it('formatDataforInsert takes an object of key/value pairs and returns an object with cols/values arrays', () => {
    const { cols, values } = databaseService.formatDataforInsert(exampleEmotion1);

    expect(cols).toEqual(['name', 'intensity']);
    expect(values).toEqual([exampleEmotion1.name, exampleEmotion1.intensity]);
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

  it('can insert an item into the database. Insert returns id of newly created item.', fakeAsync(() => {
    let result: any;

    databaseService.insert({ dbName, item: exampleEmotion1 })
    .then((data: any) => result = data);

    flushMicrotasks();

    expect(result.id).toBeDefined();
    expect(result.id).toMatch(/\d+/);
  }));

  it('can insert an item into the database. Can select item from database.', fakeAsync(() => {
    let result: any;

    insertItemToDatabase(exampleEmotion1).then((data: any) => result = data);

    flushMicrotasks();

    expect(result.name).toEqual(exampleEmotion1.name);
    expect(result.intensity).toEqual(exampleEmotion1.intensity);
  }));

  it('can insert multiple items into database', fakeAsync(() => {
    let results;

    const items = [
      exampleEmotion1,
      exampleEmotion2
    ];

    insertItemsToDatabase(items)
    .then((data: any) => results = [data[0].name, data[1].name]);

    flushMicrotasks();

    expect(results).toContain(exampleEmotion1.name);
    expect(results).toContain(exampleEmotion2.name);
  }));

  it('can update a database item', fakeAsync(() => {
    let insert;
    let update;

    insertItemToDatabase(exampleEmotion1).then((data: any) => insert = data);

    flushMicrotasks();

    databaseService.update({ dbName, id: insert.id, values: updateValues1 })
    .then(() => databaseService.select({
      dbName,
      selection: '*',
      extraStatement: `WHERE id = ${insert.id}`
    }))
    .then((data: any) => update = data[0]);

    flushMicrotasks();

    expect(insert.name).toEqual(exampleEmotion1.name);
    expect(insert.intensity).toEqual(exampleEmotion1.intensity);
    expect(update.name).toEqual(updateValues1.name);
    expect(update.intensity).toEqual(updateValues1.intensity);
  }));

  it('can bulk update database items', fakeAsync(() => {

  }));

  it('can delete database items', fakeAsync(() => {

  }));

  it('can bulk delete database items', fakeAsync(() => {

  }));
});
