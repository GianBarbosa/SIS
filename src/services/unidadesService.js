import { unidadesRepository } from '../repositories/unidadesSaude';
import unidadesData from '../data/unidadesSaudeSeed.json';

export const unidadesService = {
  
  configurarSistema: () => {
    try {
      unidadesRepository.initializeDatabase(unidadesData);
      console.log("Sistema de unidades inicializado com sucesso.");
    } catch (error) {
      console.error("Erro ao inicializar unidades de saúde:", error);
    }
  },

  obterTodas: () => {
    return unidadesRepository.listarTodas();
  },

  filtrarPorCidade: (cidade) => {
    if (!cidade) return unidadesRepository.listarTodas();
    return unidadesRepository.buscarPorCidade(cidade);
  },

  cadastrarNovaUnidade: (novaUnidade) => {
  
    if (!novaUnidade.nome || !novaUnidade.tipo) {
      throw new Error("Nome e Tipo são obrigatórios para o cadastro.");
    }
    
    return unidadesRepository.inserirUnidade(novaUnidade);
  }
};