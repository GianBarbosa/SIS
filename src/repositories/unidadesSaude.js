import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('saaude.db');

export const unidadesRepository ={
  initializeDatabase: (jsonData) => {
    db.exeSync(`
      CREATE TABLE IF NOT EXIXTS unidades (
        id INTERGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT ,
        cidade TEXT ,
        bairro TEXT ,
        tipo TEXT 
      );
    `);

    const count = db.getFirstSync('SELECT COUNT(*) as total FROM unidades');
    if (count.total === 0) {
      jsonData.registros.forEach(u => {
        db.runSync(
          'INSERT INTO unidades (nome, cidade, bairro, tipo) VALUES (?, ?, ?, ?)',
          [u.nome, u.cidade, u.bairro, u.tipo]
        );
      });
    }
  },

  listarTodas: () => {
    return db.getAllSync('SELECT *FROM unidades')
  },
  buscarPorCidade: (cidade) => {
    return db.getAllSync('SELECT * FROM unidades WHERE cidade = ?', [cidade]);
  },
  buscarPorBairro: (bairro) => {
    return db.getAllSync('SELECT * FROM unidades WHERE bairro = ?', [bairro]);
  }
};
  