import triageData from '../data/triageseed.json' assert { type: 'json' };
import { triageRepository } from '../repositories/triageRepository.js';

let perguntas = [];
let passoAtual = 0;
let scoreTotal = 0;

export const triageService = {
    configurarSistema: async () => {
        try {
            console.log("Tentando inicializar banco...");
            await triageRepository.initTriageDatabase(triageData);
            
            perguntas = triageRepository.getQuestions();
            console.log("Perguntas carregadas:", perguntas.length);

            if (perguntas.length > 0) {
                triageService.renderizar();
            } else {
                document.getElementById('question-text').innerText = "Erro: Banco vazio.";
            }
        } catch (error) {
            console.error("Erro detalhado:", error);
            document.getElementById('question-text').innerText = "Erro ao conectar ao SQLite.";
        }
    },

    renderizar: () => {
        const q = perguntas[passoAtual];
        document.getElementById('question-text').innerText = q.txt;
        document.getElementById('fase-label').innerText = `Fase ${q.fase}`;
        
        const progresso = (passoAtual / perguntas.length) * 100;
        document.getElementById('progress-fill').style.width = progresso + "%";
    },

    processarResposta: (escolha) => {
        const q = perguntas[passoAtual];
        if (escolha === 'S') {
            if (q.type === "EMG") return triageService.finalizar(true);
            scoreTotal += (q.pts || 0);
        }
        passoAtual++;
        if (passoAtual < perguntas.length) {
            triageService.renderizar();
        } else {
            triageService.finalizar();
        }
    },

    finalizar: (emergencia = false) => {
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('result-screen').style.display = 'block';
        // ... (resto da lógica de cores igual ao anterior)
    }
};

// Vincula ao HTML
window.handleAnswer = (ans) => triageService.processarResposta(ans);

// Executa a carga
triageService.configurarSistema();