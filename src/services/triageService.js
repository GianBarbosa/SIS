import triageData from '../data/triageseed.json';
import { triageRepository } from '../repositories/triageRepository';

let perguntas = [];
let passoAtual = 0;
let scoreTotal = 0;

export const triageService = {

  configurarSistema: async () => {

    try {

      console.log("Inicializando SQLite...");

      await triageRepository.initTriageDatabase(triageData);

      perguntas = triageRepository.getQuestions();

      console.log("Perguntas carregadas:", perguntas.length);

      return perguntas;

    } catch (error) {

      console.log("Erro:", error);

      return [];

    }

  },

  getPerguntaAtual: () => {
    return perguntas[passoAtual];
  },

  getProgresso: () => {
    return ((passoAtual + 1) / perguntas.length) * 100;
  },

  processarResposta: (escolha) => {

    const q = perguntas[passoAtual];

    if (escolha === 'S') {

      if (q.type === 'EMG') {

        triageRepository.salvarTriagem(
          perguntas,
          'EMERGÊNCIA'
        );

        return {
          finalizado: true,
          resultado: 'EMERGÊNCIA IMEDIATA'
        };

      }

      scoreTotal += (q.pts || 0);

    }

    passoAtual++;

    if (passoAtual >= perguntas.length) {

      let resultado = 'BAIXO RISCO';

      if (scoreTotal >= 8) {
        resultado = 'ALTO RISCO';
      }
      else if (scoreTotal >= 4) {
        resultado = 'RISCO MODERADO';
      }

      triageRepository.salvarTriagem(
        perguntas,
        resultado
      );

      return {
        finalizado: true,
        resultado
      };

    }

    return {
      finalizado: false,
      pergunta: perguntas[passoAtual]
    };

  }

};