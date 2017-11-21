import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { tables } from '../assets/sql/tables';
import 'rxjs/add/operator/map';

@Injectable()
export class DatabaseService {

  database: SQLiteObject;
  // kind of an Observable - can emit new values to the subscribers by calling next() on it
  databaseReady: BehaviorSubject<boolean>;

  constructor(private platform: Platform, private sqlite: SQLite, private sqlitePorter: SQLitePorter, private storage: Storage) {
    this.initializeDatabase();
  }

  initializeDatabase(dbName: string = 'mindful') {
    this.databaseReady = new BehaviorSubject(false);
    return this.platform.ready().then(() => {
      return this.sqlite.create({
        name: `${dbName}.db`,
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        return this.select({ selection: 'name', dbName: 'sqlite_master', extraStatement: "WHERE type='table'"})
      }).then(data => {
        //If there are tables, database has been seeded
        if (data.length > 0) {
          //sets to true and emits to subscribers that database is ready to access
          this.databaseReady.next(true);
        } else {
          return this.fillDatabase();
        }
      })
    })
  }

  fillDatabase() {
    return this.sqlitePorter.importSqlToDb(this.database, tables)
    .then(data => {
      this.databaseReady.next(true);
      this.storage.set('database_filled', true);
    })
  }

  formatSqlValue(val) {
    if (typeof val === 'number') return val;
    val = val.replace(/\'/g, "''")
    return `'${val}'`;
  }

  //items = [{col, value, selector }] -> [{col: id, val: 1, selector: '=' }]
  //conditions = ['OR', 'AND']
  createWhereStatement(items, conditions) {
    const whereStatements = items.map(({ col, value, selector = '=' }, idx) => `${col} ${selector} ${this.formatSqlValue(value)} ${conditions[idx] || ''}`).join(' ');
    return `WHERE ${whereStatements}`
  }

  createSqlInsertStatement(cols: string[], values: string[], dbName: string) {
    const sqlCols = cols.join(', ');
    const sqlValues = values.map(val => this.formatSqlValue(val)).join(", ");
    return `INSERT INTO ${dbName} (${sqlCols}) VALUES (${sqlValues});`;
  }

  createSqlSelectStatement(selection: string, dbName: string, extraStatement: string) {
    return `SELECT ${selection} FROM ${dbName} ${extraStatement};`
  }

  createSqlUpdateStatement(values: object[], id: number, dbName: string) {
    const updateSql = values.map((val: any) => `${val.col} = ${this.formatSqlValue(val.value)}`).join(', ');
    return `UPDATE ${dbName} SET ${updateSql} WHERE id = ${id};`;
  }

  createSqlDeleteStatement(dbName: string, extraStatement: string) {
    return `DELETE FROM ${dbName} ${extraStatement};`;
  }

  executeSql(sql: string) {
    return this.database.executeSql(sql, {})
    .then(data => data);
  }

  select({ dbName, selection, extraStatement = ''}) {
    const sql = this.createSqlSelectStatement(selection, dbName, extraStatement);
    return this.executeSql(sql)
    .then(data => this.processSqlResults(data));
  }

  //E.G. item = {mealId: 1, foodId: 2}
  insert({ dbName, item }) {
    const { cols, values} = this.formatDataforInsert(item);
    const sql = this.createSqlInsertStatement(cols, values, dbName);
    return this.executeSql(sql)
    .then(data => this.select({ dbName, selection: 'MAX(id)' }))
    .then(data => ({ id: data[0]['MAX(id)'] }));
  }

  //E.G. items = [{ mealId: 1, foodId: 2}, ...]
  bulkInsert({ dbName, items}) {
    const sqlStatements = items.map((item) => {
      const { cols, values } = this.formatDataforInsert(item);
      return this.createSqlInsertStatement(cols, values, dbName)
    });
    return this.batchSql(sqlStatements);
  }

  // E.G. values = [{ col: 'name', value: 'Johanna' }, { col: 'age', value: 28}]
  update({ dbName, values, id }) {
    if(values.length < 1) return Promise.resolve({ id });

    const formattedValues = this.formatDataForUpdate(values);

    const sql = this.createSqlUpdateStatement(formattedValues, id, dbName);
    return this.executeSql(sql)
  }

  //E.G. items = [{ id, values: []}, ...]
  bulkUpdate({ dbName, items}) {
    const sqlStatements = items.map(({ id, values }) => {
      const formattedValues = this.formatDataForUpdate(values);
      return this.createSqlUpdateStatement(formattedValues, id, dbName)
    });
    return this.batchSql(sqlStatements);
  }

  delete({ dbName, extraStatement}) {
    if (!extraStatement) return Promise.reject('No Where Statement Provided');
    const sql = this.createSqlDeleteStatement(dbName, extraStatement);
    return this.executeSql(sql);
  }

  bulkDelete({ dbName, extraStatements }) {
    if (!extraStatements || extraStatements.length < 1) return Promise.reject('No Where Statements Provided');
    const sqlStatements = extraStatements.map(statement => this.createSqlDeleteStatement(dbName, statement));
    return this.batchSql(sqlStatements);
  }

  batchSql(sql: Array<string>) {
    return this.database.sqlBatch(sql);
  }

  processSqlResults(data) {
    let results = [];
    if (data.rows && data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        results.push(data.rows.item(i));
      }
    }
    return results;
  }

  formatDataForUpdate(data: object) {
    const values = [];
    for (let col in data) {
      values.push({col, value: data[col]});
    }

    return values;
  }

  formatDataforInsert(data) {
    const cols = [], values = [];

    for (let prop in data) {
      cols.push(prop);
      values.push(data[prop]);
    }

    return { cols, values };
  }

}
