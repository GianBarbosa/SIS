let accessibility = {
  fontSize: 24,
  contrast: 0
};

const db = {

  execSync: () => {},

  getFirstSync: (query) => {

    // accessibility
    if (
      query.includes('accessibility')
    ) {

      return accessibility;

    }

    // perguntas
    if (
      query.includes('COUNT')
    ) {

      return {
        total: 1
      };

    }

    return {};

  },

  getAllSync: () => [],

  runSync: (query, values) => {

    // fonte
    if (
      query.includes('fontSize')
    ) {

      accessibility.fontSize =
        values[0];

    }

    // contraste
    if (
      query.includes('contrast')
    ) {

      accessibility.contrast =
        values[0];

    }

  }

};

export default db;