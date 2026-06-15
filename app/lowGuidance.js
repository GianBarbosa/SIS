import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default function LowGuidance() {
    const router = useRouter();

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={() => router.back()}>
                <LinearGradient
                    colors={['#d3d3d3', '#BABABA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.backButton}
                >
                    <View style={styles.backContent}>

                        <View style={styles.circle}>
                            <Text style={styles.arrow}>←</Text>
                        </View>

                        <Text style={styles.backText}>
                            Voltar
                        </Text>

                    </View>
                </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.title}>
                Orientações básicas de saúde
            </Text>

            <Text style={styles.subtitle}>
                Baixo risco no momento
            </Text>

            {/* CARDS */}
            <LinearGradient
                colors={['#ffffff', '#efefef']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <Text style={styles.cardTitle}>O que fazer agora</Text>
                <Text style={styles.cardText}>
                    • Repouso se necessário{"\n"}
                    • Hidratação constante{"\n"}
                    • Observe sintomas
                </Text>
            </LinearGradient>

            <LinearGradient
                colors={['#ffffff', '#efefef']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <Text style={styles.cardTitle}>Sinais de alerta</Text>
                <Text style={styles.cardText}>
                    • Febre persistente{"\n"}
                    • Dor forte{"\n"}
                    • Falta de ar{"\n"}
                    • Tontura
                </Text>
            </LinearGradient>

            <LinearGradient
                colors={['#ffffff', '#efefef']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <Text style={styles.cardTitle}>Cuidados gerais</Text>
                <Text style={styles.cardText}>
                    • Alimentação leve{"\n"}
                    • Sono adequado{"\n"}
                    • Evitar automedicação
                </Text>
            </LinearGradient>

            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: '/healthUnits',
                        params: {
                            riskDegree: 'LOW',
                        },
                    })
                }
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#08410A', '#15A608']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        Ver unidades próximas
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/triage')}
                activeOpacity={0.9}
            >
                <Text style={styles.link}>
                    Refazer avaliação
                </Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
                Esta avaliação não substitui atendimento médico profissional.
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        paddingHorizontal: 30,
        paddingTop: 15,
    },

    backButton: {
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignSelf: 'flex-start',
        marginBottom: 30,
    },

    backContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    arrow: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#082841',
        marginTop: -5,
    },

    backText: {
        color: '#082841',
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'Roboto',
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#61A72C',
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 16,
        color: '#4a4a4a',
        marginBottom: 20,
    },

    card: {
        borderRadius: 16,
        padding: 14,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#082841',
    },

    cardText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },

    button: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 14,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },

    link: {
        textAlign: 'center',
        marginTop: 14,
        color: '#61A72C',
        fontSize: 15,
    },

    disclaimer: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 15,
        color: '#888',
    },
});