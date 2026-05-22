import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import triageService from '../src/services/triageService';
import { LinearGradient } from 'expo-linear-gradient';

export default function TriageRoute() {
    const router = useRouter();
    const [currentNode, setCurrentNode] = useState(null);
    const [showPhase3PreChoice, setShowPhase3PreChoice] = useState(false);
    const [riskDegree, setRiskDegree] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const phase = useRef(null);

    async function start() {
        setIsLoading(true);
        try {
            setCurrentNode(await triageService.startPhase1());
            phase.current = 1;
        } finally {
            setIsLoading(false);
        }
    }

    async function handleChoice(choice) {
        const answer = choice ? 'positive' : 'negative';
        if (phase.current === 1 && answer === 'positive') {
            setCurrentNode(null);
            setRiskDegree('EMERGENCY');
            return;
        }

        const nextNode = await triageService.nextNode(phase.current, currentNode, answer);
        if (nextNode.node) {
            setCurrentNode(nextNode.node);
        } else if (nextNode.riskDegree) {
            setRiskDegree(nextNode.riskDegree);
        } else if (phase.current === 1) {
            setCurrentNode(await triageService.startPhase2());
            phase.current = 2;
        } else if (phase.current === 2) {
            setCurrentNode(null);
            setShowPhase3PreChoice(true);
            phase.current = 3;
        } else {
            setCurrentNode(null);
        }
    }

    async function handlePhase3PreChoice(ageGroup) {
        setCurrentNode(await triageService.startPhase3(ageGroup));
        setShowPhase3PreChoice(false);
    }

    useEffect(() => {
        start();
    }, []);

    const statusText = isLoading
        ? 'Carregando triagem...'
        : currentNode
            ? currentNode.question
            : showPhase3PreChoice
                ? 'Qual a faixa etária do paciente?'
                : 'Triagem completa!';

    return (

        <View style={styles.container}>

         <View style={styles.topContainer}>

            <Pressable
                onPress={() => router.push('/')}
                style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
            >

                <LinearGradient
                    colors={['#d3d3d3', '#BABABA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.cancelButton}
                >

                    <View style={styles.cancelTouchable}>

                        <Text style={styles.cancelText}>
                            Cancelar
                        </Text>

                        <View style={styles.closeCircle}>
                            <Text style={styles.closeText}>
                                ✕
                            </Text>
                        </View>

                    </View>

                </LinearGradient>

            </Pressable>

         </View>

            {isLoading && (
                <ActivityIndicator
                    size="small"
                    color="#082841"
                />
            )}

            <LinearGradient
                colors={['#ffff', '#efefef']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >

                <LinearGradient
                    colors={['#082841', '#0860A6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.stepBadge}
                >
                    <Text style={styles.stepText}>
                        {phase.current || 1}
                    </Text>
                </LinearGradient>
                <Text style={styles.question}>
                    {statusText}
                </Text>


                {currentNode && (
                    <View>

                        <View style={styles.optionWrapper}>

                            <TouchableOpacity
                                onPress={() => handleChoice(true)}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={['#f4f4f4', '#d5d5d5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.optionGradient}
                                >
                                    <View style={styles.option}>
                                        <View style={styles.optionBadge}>
                                            <Text style={styles.optionBadgeText}>
                                                A
                                            </Text>
                                        </View>
                                        <Text style={styles.optionText}>
                                            Sim
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.optionWrapper}>

                            <TouchableOpacity
                                onPress={() => handleChoice(false)}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={['#f4f4f4', '#d5d5d5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.optionGradient}
                                >
                                    <View style={styles.option}>
                                        <View style={styles.optionBadge}>
                                            <Text style={styles.optionBadgeText}>
                                                B
                                            </Text>
                                        </View>
                                        <Text style={styles.optionText}>
                                            Não
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>

                    </View>
                                    )}


                {showPhase3PreChoice && (

                    <View>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handlePhase3PreChoice('baby')}
                            activeOpacity={0.9}
                        >

                            <View style={styles.optionBadge}>
                                <Text style={styles.optionBadgeText}>
                                    A
                                </Text>
                            </View>

                            <Text style={styles.optionText}>
                                Bebê (0-1 anos)
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handlePhase3PreChoice('adult')}
                            activeOpacity={0.9}
                        >

                            <View style={styles.optionBadge}>
                                <Text style={styles.optionBadgeText}>
                                    B
                                </Text>
                            </View>

                            <Text style={styles.optionText}>
                                Jovem/Adulto (2-59 anos)
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handlePhase3PreChoice('elderly')}
                            activeOpacity={0.9}
                        >

                            <View style={styles.optionBadge}>
                                <Text style={styles.optionBadgeText}>
                                    C
                                </Text>
                            </View>

                            <Text style={styles.optionText}>
                                Idoso (60-75 anos)
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handlePhase3PreChoice('late-elderly')}
                            activeOpacity={0.9}
                        >

                            <View style={styles.optionBadge}>
                                <Text style={styles.optionBadgeText}>
                                    D
                                </Text>
                            </View>

                            <Text style={styles.optionText}>
                                Idoso (75+ anos)
                            </Text>

                        </TouchableOpacity>

                    </View>

                )}

            </LinearGradient>

            {riskDegree && (

                <View style={styles.resultContainer}>

                    <Text style={styles.resultText}>
                        Grau de risco: {riskDegree}
                    </Text>

                </View>

            )}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        paddingHorizontal: 30,
        paddingTop: 50,
    },

    topContainer: {
        alignItems: 'flex-end',
    },

    cancelButton: {
        borderRadius: 999,
        paddingLeft: 18,
        paddingRight: 4,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    cancelText: {
        color: '#082841',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Roboto',
    },

    cancelTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    closeCircle: {
        width: 28,
        height: 28,
        borderRadius: 999,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    closeText: {
        color: '#082841',
        fontSize: 15,
        fontWeight: 'bold',
    },

    card: {
        marginTop: 140,
        borderRadius: 20,
        padding: 22,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },

    stepBadge: {
        width: 32,
        height: 32,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },

    stepText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    question: {
        fontSize: 24,
        color: '#082841',
        marginBottom: 26,
        lineHeight: 34,
        fontFamily: 'Roboto',
    },

    optionWrapper: {
    marginBottom: 18,
    },

    optionGradient: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#c5c8cb',
        overflow: 'hidden',
    },

    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
    },

    optionBadge: {
        backgroundColor: '#f0f5f9',
        width: 26,
        height: 26,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#aab8c2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    optionBadgeText: {
        color: '#082841',
        fontSize: 14,
    },

    optionText: {
        color: '#082841',
        fontSize: 18,
        fontFamily: 'Roboto',
    },

    resultContainer: {
        marginTop: 30,
        backgroundColor: '#082841',
        borderRadius: 16,
        padding: 20,
    },

    resultText: {
        color: '#fff',
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
    },

});