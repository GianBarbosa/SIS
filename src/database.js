import * as SQLite from 'expo-sqlite';

const db =
  SQLite.openDatabaseSync(
    'triagem.db'
  );

export default db;