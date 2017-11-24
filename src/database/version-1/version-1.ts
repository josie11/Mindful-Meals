import { schema, allVersionSeed } from './sql';
import { DatabaseVersion } from '../../common/types';

export const version1: DatabaseVersion = {
  version: 1,
  schema,
  changes: null,
  allVersionSeed,
  versionSpecificSeed: allVersionSeed
}
