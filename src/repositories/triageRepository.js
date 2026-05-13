import db from '../database';

export const triageRepository = {

  initTriageDatabase: async (jsonData) => {

    db.execSync(`
      CREATE TABLE IF NOT EXISTS perguntas_triagem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        txt TEXT NOT NULL,
        type TEXT,
        pts INTEGER,
        fase TEXT
      );

      CREATE TABLE IF NOT EXISTS triagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        respostas TEXT,
        resultado TEXT,
        data TEXT
      );
    `);

    const result = db.getFirstSync(
      'SELECT COUNT(*) as total FROM perguntas_triagem'
    );

    if (result?.total === 0 && jsonData?.perguntas) {

      console.log("Semeando perguntas...");

      jsonData.perguntas.forEach((q) => {

        db.runSync(
          `INSERT INTO perguntas_triagem
          (txt, type, pts, fase)
          VALUES (?, ?, ?, ?)`,
          [
            q.txt,
            q.type,
            q.pts,
            q.fase
          ]
        );

      });

    }

  },

  getQuestions: () => {

    return db.getAllSync(
      'SELECT * FROM perguntas_triagem ORDER BY id ASC'
    );

  },

  salvarTriagem: (respostas, resultado) => {

    db.runSync(
      `INSERT INTO triagens
      (respostas, resultado, data)
      VALUES (?, ?, ?)`,
      [
        JSON.stringify(respostas),
        resultado,
        new Date().toISOString()
      ]
    );

    console.log("Triagem salva 🔥");

  }

};