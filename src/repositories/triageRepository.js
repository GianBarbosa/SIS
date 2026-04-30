import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('triage.db');

export const triageRepository = {
  // Inicializa o banco recebendo os dados do JSON
  initTriageDatabase: (jsonData) => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS perguntas_triagem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        txt TEXT NOT NULL,
        type TEXT,
        pts INTEGER,
        fase TEXT
      );
    `);

    const result = db.getFirstSync('SELECT COUNT(*) as total FROM perguntas_triagem');
    
    if (result.total === 0 && jsonData && jsonData.perguntas) {
      console.log("Semeando perguntas no SQLite...");
      jsonData.perguntas.forEach(q => {
        db.runSync(
          'INSERT INTO perguntas_triagem (txt, type, pts, fase) VALUES (?, ?, ?, ?)',
          [q.txt, q.type, q.pts, q.fase]
        );
      });
    }
  },

  // Retorna todas as perguntas ordenadas
  getQuestions: () => {
    return db.getAllSync('SELECT * FROM perguntas_triagem ORDER BY id ASC');
  }
};