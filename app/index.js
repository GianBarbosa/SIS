import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function IndexRoute() {
  const router = useRouter();

return (
    <View style={styles.container}>
      
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Responda rapidamente e descubra seu{' '}
        <Text style={styles.bold}>
          nível de risco
        </Text>
        {' '}com uma{' '}
        <Text style={styles.bold}>
          orientação imediata
        </Text>
      </Text>

    <LinearGradient
      colors={['#082841', '#0860A6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.button}
    >
    <Pressable
      onPress={() => router.push('/triage')}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
    >
    <Text style={styles.buttonText}>
      Começar avaliação
    </Text>
    </Pressable>
    </LinearGradient>

    <Pressable
      onPress={() => router.push({ pathname: '/healthUnits', params: { riskDegree: 'EMERGENCY' } })}
      style={({ pressed }) => ([
        styles.testButton,
        { transform: [{ scale: pressed ? 0.96 : 1 }] },
      ])}
    >
      <Text style={styles.testButtonText}>
        Ver unidades de emergencia
      </Text>
    </Pressable>

      <View style={styles.doctorContainer}>
  
        <View style={styles.circle} />

        <Image
          source={require('../assets/images/doctor.png')}
          style={styles.doctor}
          resizeMode="contain"
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 70,
    paddingHorizontal: 60,
  },

  logo: {
    width: 120,
    height: 40,
    marginBottom: 40,
  },

  title: {
    fontSize: 30,
    fontFamily: 'Roboto',
    color: '#082841',
    lineHeight: 40,
    marginBottom: 40,
  },

  bold: {
    fontWeight: 'bold',
  },

  button: {
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: 'center',
    width: 220,
    marginBottom: 5,
    alignSelf: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },

  testButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 24,
  },

  testButtonText: {
    color: '#082841',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '700',
  },
  
  doctorContainer: {
  position: 'relative',
  alignItems: 'center',
  marginTop: 'auto',
  },

  circle: {
    position: 'absolute',
    width: 370,
    height: 370,
    borderRadius: 1000,
    backgroundColor: '#D3D3D3',
    bottom: -110,
    left: -40,
  },

  doctor: {
    width: 450,
    height: 379,
    alignSelf: 'center',
    marginTop: 'auto',
    left: 20,
  },
});
