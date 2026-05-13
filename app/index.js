import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import triageData from '../src/data/triageseed.json';

export default function IndexRoute() {

  const [loading, setLoading] =
    useState(true);

  const [perguntas, setPerguntas] =
    useState([]);

  const [indice, setIndice] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [resultado, setResultado] =
    useState(null);

  useEffect(() => {

    carregarPerguntas();

  }, []);

  function carregarPerguntas() {

    try {

      setPerguntas(
        triageData.perguntas
      );

    } catch (error) {

      console.log(
        'Erro:',
        error
      );

    } finally {

      setLoading(false);

    }

  }

  function responder(resposta) {

    const pergunta =
      perguntas[indice];

    // Emergência
    if (
      resposta === 'S' &&
      pergunta.type === 'EMG'
    ) {

      setResultado(
        'EMERGÊNCIA IMEDIATA'
      );

      return;

    }

    // Soma score
    let novoScore = score;

    if (resposta === 'S') {

      novoScore += (
        pergunta.pts || 0
      );

      setScore(novoScore);

    }

    const proximo =
      indice + 1;

    // Finalizar
    if (
      proximo >= perguntas.length
    ) {

      if (novoScore >= 8) {

        setResultado(
          'ALTO RISCO'
        );

      }
      else if (novoScore >= 4) {

        setResultado(
          'RISCO MODERADO'
        );

      }
      else {

        setResultado(
          'BAIXO RISCO'
        );

      }

      return;

    }

    setIndice(proximo);

  }

  // Loading
  if (loading) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >

        <ActivityIndicator size="large" />

        <Text>
          Carregando...
        </Text>

      </View>

    );

  }

  // Resultado
if (resultado) {

  return (

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}
    >

      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginBottom: 20
        }}
      >
        Resultado
      </Text>

      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color:
            resultado.includes('EMERGÊNCIA')
              ? 'red'
              : resultado.includes('ALTO')
              ? 'orange'
              : 'green'
        }}
      >
        {resultado}
      </Text>

      <TouchableOpacity
        onPress={() => {

          setIndice(0);
          setScore(0);
          setResultado(null);

        }}
        style={{
          marginTop: 30,
          backgroundColor: '#2196f3',
          padding: 16,
          borderRadius: 12,
          width: '100%'
        }}
      >

        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold'
          }}
        >
          VOLTAR AO INÍCIO
        </Text>

      </TouchableOpacity>

    </View>

  );

}
  // Sem perguntas
  if (
    !perguntas ||
    perguntas.length === 0
  ) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >

        <Text>
          Nenhuma pergunta encontrada
        </Text>

      </View>

    );

  }

  const perguntaAtual =
    perguntas[indice];

  const progresso =
    ((indice + 1) /
      perguntas.length) * 100;

  return (

    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff'
      }}
    >

      <Text
        style={{
          marginBottom: 10,
          fontSize: 18
        }}
      >
        Progresso:
        {' '}
        {Math.floor(progresso)}%
      </Text>

      <View
        style={{
          height: 10,
          backgroundColor: '#ddd',
          borderRadius: 20,
          marginBottom: 30
        }}
      >

        <View
          style={{
            width: `${progresso}%`,
            height: 10,
            backgroundColor: '#4caf50',
            borderRadius: 20
          }}
        />

      </View>

      <Text
        style={{
          fontSize: 28,
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: 40
        }}
      >
        {perguntaAtual.txt}
      </Text>

      <TouchableOpacity
        onPress={() => responder('S')}
        style={{
          backgroundColor: '#e53935',
          padding: 18,
          borderRadius: 12,
          marginBottom: 20
        }}
      >

        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 'bold'
          }}
        >
          SIM
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => responder('N')}
        style={{
          backgroundColor: '#43a047',
          padding: 18,
          borderRadius: 12
        }}
      >

        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 'bold'
          }}
        >
          NÃO
        </Text>

      </TouchableOpacity>

    </View>

  );

} 