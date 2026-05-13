import * as SQLite from 'expo-sqlite';

export async function getDB() {

  const db = await SQLite.openDatabaseAsync(
    'triagem.db'
  );

  return db;

}