import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { DatabaseService } from './database.service';
import 'rxjs/add/operator/map';
import { database } from '../database/database';
import { DatabaseVersion } from '../common/types';

@Injectable()
export class AppSetupService {
  constructor(private databaseService: DatabaseService, private sqlitePorter: SQLitePorter) {
  }

  initializeApp(version: number) {
    this.databaseService.initializeDatabase()
    .then(() => this.checkCurrentDatabaseVersion())
    .then((databaseVersion) => {
      console.log(databaseVersion, version)
      if (databaseVersion === 0) {
        return this.initializeDatabase(version);
      } else if (databaseVersion !== version) {
        // return this.updateDatabaseToVersion(databaseVersion, version);
      }
    })
  }

  checkCurrentDatabaseVersion() {
    return this.databaseService.database.executeSql('PRAGMA user_version;', {})
    .then((data: any) => data.rows.item(0)['user_version']);
  }

  updateDatabaseToVersion(currentVersion: number, updatedVersion: number) {
    const updates: string[] = [];
    while (currentVersion < updatedVersion) {
      const currentDatabaseData: DatabaseVersion = database[currentVersion];
      if (currentDatabaseData.changes) updates.push(currentDatabaseData.changes);
      if (currentDatabaseData.versionSpecificSeed) updates.push(currentDatabaseData.versionSpecificSeed);
      currentVersion += 1;
    }
    // return this.sqlitePorter.importSqlToDb(this.databaseService.database, updates)
    // .then(() => this.updateDatabaseVersion(updatedVersion));
  }

  initializeDatabase(version) {
    const currentDatabaseData: DatabaseVersion = database[version];

    return this.sqlitePorter.importSqlToDb(this.databaseService.database, currentDatabaseData.schema)
    .then(() => {
      if (currentDatabaseData.allVersionSeed) return this.sqlitePorter.importSqlToDb(this.databaseService.database,currentDatabaseData.allVersionSeed);
    })
    .then(() => this.updateDatabaseVersion(version));
  }

  updateDatabaseVersion(version) {
    return this.databaseService.executeSql(`PRAGMA user_version = ${version}`);
  }


}
