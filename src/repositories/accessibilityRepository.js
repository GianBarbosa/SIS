import db from '../database';

export const accessibilityRepository = {

  initAccessibilityTable: () => {

    db.execSync(`
      CREATE TABLE IF NOT EXISTS accessibility (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fontSize INTEGER,
        contrast INTEGER
      );
    `);

    const result = db.getFirstSync(
      'SELECT COUNT(*) as total FROM accessibility'
    );

    if (result.total === 0) {

      db.runSync(
        `INSERT INTO accessibility
        (fontSize, contrast)
        VALUES (?, ?)`,
        [24, 0]
      );

    }

  },

  getAccessibility: () => {

    return db.getFirstSync(
      'SELECT * FROM accessibility LIMIT 1'
    );

  },

  updateFontSize: (size) => {

    db.runSync(
      `UPDATE accessibility
      SET fontSize = ?`,
      [size]
    );

  },

  updateContrast: (contrast) => {

    db.runSync(
      `UPDATE accessibility
      SET contrast = ?`,
      [contrast]
    );

  }

};