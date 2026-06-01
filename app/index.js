import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import triageData from '../src/data/triageseed.json';

export default function IndexRoute() {

  const [loading, setLoading] = useState(true);
  const [perguntas, setPerguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [score, setScore] = useState(0);
  const [resultado, setResultado] = useState(null);

  const [fontSize, setFontSize] = useState(24);
  const [highContrast, setHighContrast] = useState(false);
  const [menuAcessibilidade, setMenuAcessibilidade] =
    useState(false);

  useEffect(() => {

    setPerguntas(triageData.perguntas);
    setLoading(false);

  }, []);

  function aumentarFonte() {

    setFontSize((valor) => {

      if (valor >= 40) return 40;

      return valor + 4;

    });

  }

  function diminuirFonte() {

    setFontSize((valor) => {

      if (valor <= 16) return 16;

      return valor - 4;

    });

  }

  function alternarContraste() {

    setHighContrast(!highContrast);

  }

  function responder(resposta) {

    const pergunta = perguntas[indice];

    if (
      resposta === 'S' &&
      pergunta.type === 'EMG'
    ) {

      setResultado('EMERGÊNCIA IMEDIATA');
      return;

    }

    let novoScore = score;

    if (resposta === 'S') {

      novoScore += pergunta.pts || 0;

      setScore(novoScore);

    }

    const proximo = indice + 1;

    if (proximo >= perguntas.length) {

      if (novoScore >= 8) {

        setResultado('ALTO RISCO');

      } else if (novoScore >= 4) {

        setResultado('RISCO MODERADO');

      } else {

        setResultado('BAIXO RISCO');

      }

      return;

    }

    setIndice(proximo);

  }

  function reiniciar() {

    setIndice(0);
    setScore(0);
    setResultado(null);

  }

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

  if (resultado) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor:
            highContrast ? '#000' : '#fff'
        }}
      >

        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            color:
              highContrast ? '#fff' : '#000'
          }}
        >
          Resultado
        </Text>

        <Text
          style={{
            marginTop: 20,
            fontSize: fontSize,
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
          onPress={reiniciar}
          style={{
            marginTop: 30,
            backgroundColor: '#2196f3',
            padding: 16,
            borderRadius: 12
          }}
        >

          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            VOLTAR AO INÍCIO
          </Text>

        </TouchableOpacity>

      </View>

    );

  }

  const perguntaAtual = perguntas[indice];

  const progresso =
    ((indice + 1) /
      perguntas.length) * 100;

  return (

    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor:
          highContrast ? '#000' : '#fff'
      }}
    >

      <TouchableOpacity
        onPress={() =>
          setMenuAcessibilidade(
            !menuAcessibilidade
          )
        }
        style={{
          position: 'absolute',
          top: 50,
          right: 20,
          backgroundColor: '#1976d2',
          padding: 12,
          borderRadius: 30,
          zIndex: 999
        }}
      >

        <Text
          style={{
            color: '#fff',
            fontSize: 22
          }}
        >
          ♿
        </Text>

      </TouchableOpacity>

      {menuAcessibilidade && (

        <View
          style={{
            position: 'absolute',
            top: 110,
            right: 20,
            backgroundColor: '#eee',
            padding: 15,
            borderRadius: 12,
            zIndex: 999
          }}
        >

          <Text>
            Fonte
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10
            }}
          >

            <TouchableOpacity
              onPress={aumentarFonte}
              style={{
                backgroundColor: '#1976d2',
                padding: 10,
                borderRadius: 8,
                marginRight: 10
              }}
            >

              <Text
                style={{
                  color: '#fff'
                }}
              >
                A+
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={diminuirFonte}
              style={{
                backgroundColor: '#1976d2',
                padding: 10,
                borderRadius: 8
              }}
            >

              <Text
                style={{
                  color: '#fff'
                }}
              >
                A-
              </Text>

            </TouchableOpacity>

          </View>

          <TouchableOpacity
            onPress={alternarContraste}
            style={{
              backgroundColor: '#000',
              padding: 10,
              borderRadius: 8,
              marginTop: 15
            }}
          >

            <Text
              style={{
                color: '#fff'
              }}
            >
              Contraste
            </Text>

          </TouchableOpacity>

        </View>

      )}

      <Text
        style={{
          color:
            highContrast ? '#fff' : '#000'
        }}
      >
        Progresso: {Math.floor(progresso)}%
      </Text>

      <View
        style={{
          height: 10,
          backgroundColor: '#ddd',
          borderRadius: 10,
          marginVertical: 20
        }}
      >

        <View
          style={{
            width: `${progresso}%`,
            height: 10,
            backgroundColor: '#4caf50',
            borderRadius: 10
          }}
        />

      </View>

      <Text
        style={{
          fontSize: fontSize,
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: 40,
          color:
            highContrast ? '#fff' : '#000'
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