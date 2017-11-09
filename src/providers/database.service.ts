import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class DatabaseService {

  database: SQLiteObject;
  // kind of an Observable - can emit new values to the subscribers by calling next() on it
  private databaseReady: BehaviorSubject<boolean>;

  constructor(private http: Http, private platform: Platform, private sqlite: SQLite, private sqlitePorter: SQLitePorter, private storage: Storage) {
    this.initializeDatabase();
  }

  initializeDatabase(dbName: string = 'mindful') {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
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
          this.fillDatabase();
        }
      })
    });
  }

  fillDatabase() {
    return this.http.get('assets/sql/tables.sql')
      .map(res => res.text())
      .subscribe(sql => {
        return this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
      });
  }

  formatSqlValue(val) {
    if (typeof val === 'number') return val;
    val = val.replace(/\'/g, "''")
    return `'${val}'`;;
  }

  //items = [{col, value, selector }] -> [{col: id, val: 1, selector: '=' }]
  //conditions = ['OR', 'AND']
  createWhereStatement(items, conditions) {
    const whereStatements = items.map(({ col, value, selector = '=' }, idx) => `${col} ${selector} ${this.formatSqlValue(value)} ${conditions[idx] || ''}`).join(' ');
    return `WHERE ${whereStatements}`
  }

  createSqlInsertStatement(cols, values, dbName) {
    const sqlCols = cols.join(', ');
    const sqlValues = values.map(val => this.formatSqlValue(val)).join(", ");
    return `INSERT INTO ${dbName} (${sqlCols}) VALUES (${sqlValues});`;
  }

  createSqlSelectStatement(selection, dbName, extraStatement) {
    return `SELECT ${selection} FROM ${dbName} ${extraStatement};`
  }

  createSqlUpdateStatement(values, id, dbName) {
    const updateSql = values.map(val => `${val.col} = ${this.formatSqlValue(val.value)}`).join(', ');
    return `UPDATE ${dbName} SET ${updateSql} WHERE id = ${id};`;
  }

  createSqlDeleteStatement(dbName, extraStatement) {
    return `DELETE FROM ${dbName} ${extraStatement};`;
  }

  executeSql(sql: string) {
    return this.database.executeSql(sql, {})
    .then(data => data);
  }

  select({ selection, dbName, extraStatement = ''}) {
    const sql = this.createSqlSelectStatement(selection, dbName, extraStatement);
    return this.executeSql(sql)
    .then(data => this.processSqlResults(data));
  }

  //E.G. items = [{ cols =[mealId, name, foodId], values = [1, 'pizza', 2] }]
  bulkInsert({ dbName, items}) {
    const sqlStatements = items.map(({ cols, values }) => this.createSqlInsertStatement(cols, values, dbName));
    return this.batchSql(sqlStatements);
  }

  insert({ cols, values, dbName }) {
    const sql = this.createSqlInsertStatement(cols, values, dbName);
    return this.executeSql(sql)
    .then(data => this.select({ dbName, selection: 'MAX(id)' }))
    .then(data => ({ id: data[0]['MAX(id)'] }));
  }

  // values = [{ col, value }]
  update({ dbName, values, id }) {
    const updateSql = values.map(val => `${val.col} = ${this.formatSqlValue(val.value)}`).join(', ');
    const sql = `UPDATE ${dbName} SET ${updateSql} WHERE id = ${id};`;
    return this.executeSql(sql)
  }

  //E.G. items = [{ cols =[mealId, name, foodId], values = [1, 'pizza', 2] }]
  bulkUpdate({ dbName, items}) {
    const sqlStatements = items.map(({ cols, values }) => this.createSqlInsertStatement(cols, values, dbName));
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
    return this.database['batchSql'](sql, {})
    .then(data => {
      return this.processSqlResults(data)
    }, err => {
      console.log('Error: ', err);
      return err;
    });
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

}