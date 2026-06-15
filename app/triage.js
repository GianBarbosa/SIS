import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import triageService from '../src/services/triageService';

export default function TriageRoute() {
    const LONGEST_PATH = 28; 

    const router = useRouter();
    const [currentNode, setCurrentNode] = useState(null);
    const [showPhase3PreChoice, setShowPhase3PreChoice] = useState(false);
    const [riskDegree, setRiskDegree] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progressQuestionCounter, setProgressQuestionCounter] = useState(0);
    const phase = useRef(null);

    async function start() {
        setIsLoading(true);
        try {
            setCurrentNode(await triageService.startPhase1());
            phase.current = 1;
            setProgressQuestionCounter(0);
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
            setProgressQuestionCounter(prev => prev + 1);
            setCurrentNode(nextNode.node);
        } else if (nextNode.riskDegree) {
            setRiskDegree(nextNode.riskDegree);
        } else if (phase.current === 1) {
            setProgressQuestionCounter(prev => prev + 1);
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
        setProgressQuestionCounter(prev => prev + 1);
        setCurrentNode(await triageService.startPhase3(ageGroup));
        setShowPhase3PreChoice(false);
    }

    function restartTriage() {
    setRiskDegree(null);
    setCurrentNode(null);
    setShowPhase3PreChoice(false);
    setProgressQuestionCounter(0);
    phase.current = 1;
    start();
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

    const continuousProgress = Math.min(progressQuestionCounter / LONGEST_PATH, 1);

        if (riskDegree === 'EMERGENCY') {
        return (
            <LinearGradient
                colors={['#ffffff', '#EDC1C1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emergencyContainer}
            >

                        <View style={styles.emergencyTopContainer}>

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

                <View style={styles.emergencyContent}>

                    <Image
                        source={require('../assets/images/alerticon.png')}
                        style={styles.warningIcon}
                    />

                    <Text style={styles.emergencyTitle}>
                        Seus sintomas podem indicar um{"\n"}

                        <Text style={styles.emergencyTitleBold}>
                            alto nível de risco.
                        </Text>

                    </Text>

                    <Text style={styles.emergencyDescription}>
                        Recomendamos procurar atendimento médico imediatamente ou

                        <Text style={styles.emergencyDescriptionBold}>
                            {" "}dirigir-se à unidade de emergência
                        </Text>

                        {" "}mais próxima.
                    </Text>

                    <TouchableOpacity 
                         activeOpacity={0.9}
                         onPress={() =>
                            router.push({
                                pathname: '/healthUnits',
                                params: {
                                    riskDegree: 'EMERGENCY',
                                },
                            })
                    }>

                        <LinearGradient
                            colors={['#410808', '#A60808']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.emergencyButton}
                        >

                            <Text style={styles.emergencyButtonText}>
                                Buscar emergência próxima
                            </Text>

                        </LinearGradient>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={restartTriage}
                        activeOpacity={0.9}
                    >

                        <Text style={styles.retryText}>
                            Refazer avaliação
                        </Text>

                    </TouchableOpacity>

                    <Text style={styles.disclaimer}>
                        Esta avaliação não substitui atendimento médico profissional.
                    </Text>

                </View>

            </LinearGradient>

        );
    }       

            if (riskDegree === 'MODERATE') {
            return (
                <LinearGradient
                    colors={['#ffffff', '#ECEDC1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.moderateContainer}
                >

                            <View style={styles.moderateTopContainer}>

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

                    <View style={styles.moderateContent}>

                        <Image
                            source={require('../assets/images/alerticon2.png')}
                            style={styles.warning2Icon}
                        />

                        <Text style={styles.moderateTitle}>
                            Seus sintomas indicam um nível {"\n"}

                            <Text style={styles.moderateTitleBold}>
                                moderado de risco.
                            </Text>

                        </Text>

                        <Text style={styles.moderateDescription}>
                            Recomendamos

                            <Text style={styles.moderateDescriptionBold}>
                                {" "}procurar uma Unidade Básica de Saúde (UBS)
                            </Text>

                            {" "}para uma avaliação mais detalhada.
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                                router.push({
                                    pathname: '/healthUnits',
                                    params: {
                                        riskDegree: 'MODERATE',
                                    },
                                })
                            }
                        >                        

                            <LinearGradient
                                colors={['#414108', '#A1A608']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.moderateButton}
                            >

                                <Text style={styles.moderateButtonText}>
                                    Buscar unidade próxima
                                </Text>

                            </LinearGradient>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={restartTriage}
                            activeOpacity={0.9}
                        >

                            <Text style={styles.retry2Text}>
                                Refazer avaliação
                            </Text>

                        </TouchableOpacity>

                        <Text style={styles.disclaimer2}>
                            Esta avaliação não substitui atendimento médico profissional.
                        </Text>

                    </View>

                </LinearGradient>

            );
        }

            if (riskDegree === 'LOW') {
            return (
                <LinearGradient
                    colors={['#ffffff', '#C5EDC1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.lowContainer}
                >

                            <View style={styles.lowTopContainer}>

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

                    <View style={styles.lowContent}>

                        <Image
                            source={require('../assets/images/alerticon3.png')}
                            style={styles.warning3Icon}
                        />

                        <Text style={styles.lowTitle}>
                            Seus sintomas indicam um{"\n"}

                            <Text style={styles.lowTitleBold}>
                                baixo nível de risco no momento.
                            </Text>

                        </Text>

                        <Text style={styles.lowDescription}>

                            <Text style={styles.lowDescriptionBold}>
                                Continue acompanhando sua saúde e mantenha cuidados básicos
                            </Text>

                            {" "}para o seu bem-estar.

                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                                router.push({
                                    pathname: '/lowGuidance',
                                    params: {
                                        riskDegree: 'LOW',
                                    },
                                })
                            }
                        >      

                            <LinearGradient
                                colors={['#08410A', '#15A608']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.lowButton}
                            >

                                <Text style={styles.lowButtonText}>
                                    Ver orientações
                                </Text>

                            </LinearGradient>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={restartTriage}
                            activeOpacity={0.9}
                        >

                            <Text style={styles.retry3Text}>
                                Refazer avaliação
                            </Text>

                        </TouchableOpacity>

                        <Text style={styles.disclaimer3}>
                            Esta avaliação não substitui atendimento médico profissional.
                        </Text>

                    </View>

                </LinearGradient>

            );
        }


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

                <View style={styles.progressSection}>
                    <View style={styles.relativeProgressTrack}>
                        <View
                            style={[
                                styles.relativeProgressFill,
                                { width: `${Math.max(continuousProgress * 100, 0)}%` },
                            ]}
                        />
                    </View>

                    {currentNode && (
                        <Text style={styles.questionCounterText}>
                            {Math.round(continuousProgress * 100)}%
                        </Text>
                    )}
                </View>

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

                        <View style={styles.optionWrapper}>

                            <TouchableOpacity
                                onPress={() => handlePhase3PreChoice('baby')}
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
                                            Bebê (0-1 anos)
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.optionWrapper}>

                            <TouchableOpacity
                                onPress={() => handlePhase3PreChoice('adult')}
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
                                            Jovem/Adulto (2-59 anos)
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.optionWrapper}>

                            <TouchableOpacity
                                onPress={() => handlePhase3PreChoice('elderly')}
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
                                                C
                                            </Text>
                                        </View>
                                        <Text style={styles.optionText}>
                                            Idoso (60-75 anos)
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.optionWrapper}>

                            <TouchableOpacity
                                onPress={() => handlePhase3PreChoice('late-elderly')}
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
                                                D
                                            </Text>
                                        </View>
                                        <Text style={styles.optionText}>
                                            Idoso (75+ anos)
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>

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
        paddingTop: 20,
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

    progressSection: {
        marginBottom: 18,
    },

    relativeProgressTrack: {
        width: '100%',
        height: 10,
        borderRadius: 999,
        backgroundColor: '#D7DEE4',
        overflow: 'hidden',
    },

    relativeProgressFill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: '#0860A6',
    },

    questionCounterText: {
        marginTop: 8,
        color: '#5C6E7F',
        fontSize: 13,
        fontWeight: '600',
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


    emergencyContainer: {
        flex: 1,
        paddingTop: 20,
    },

    emergencyTopContainer: {
        alignItems: 'flex-end',
        paddingHorizontal: 30,
    },

    emergencyContent: {
        flex: 1,
        paddingHorizontal: 60,
    },

    warningIcon: {
        width: 130,
        height: 130,
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 25,
    },

    emergencyTitle: {
        color: '#8B1F1F',
        fontSize: 28,
        lineHeight: 38,
        marginBottom: 24,
        fontFamily: 'Roboto',
    },

    emergencyTitleBold: {
        fontWeight: 'bold',
    },

    emergencyDescription: {
        color: '#8B1F1F',
        fontSize: 15.6,
        lineHeight: 22,
        marginBottom: 50,
        fontFamily: 'Roboto',
    },

    emergencyDescriptionBold: {
        fontWeight: 'bold',
    },

    emergencyButton: {
        height: 56,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emergencyButtonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Roboto',
    },

    retryText: {
        textAlign: 'center',
        marginTop: 22,
        color: '#8B1F1F',
        fontSize: 16,
    },

    disclaimer: {
        marginTop: 'auto',
        marginBottom: 50,
        textAlign: 'center',
        color: '#8B1F1F',
        fontSize: 15,
    },

    
    moderateContainer: {
        flex: 1,
        paddingTop: 20,
    },

    moderateTopContainer: {
        alignItems: 'flex-end',
        paddingHorizontal: 30,
    },

    moderateContent: {
        flex: 1,
        paddingHorizontal: 60,
    },

    warning2Icon: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 45,
        marginBottom: 45,
    },

    moderateTitle: {
        color: '#A7942C',
        fontSize: 28,
        lineHeight: 38,
        marginBottom: 24,
        fontFamily: 'Roboto',
    },

    moderateTitleBold: {
        fontWeight: 'bold',
    },

    moderateDescription: {
        color: '#A7942C',
        fontSize: 15.6,
        lineHeight: 22,
        marginBottom: 50,
        fontFamily: 'Roboto',
    },

    moderateDescriptionBold: {
        fontWeight: 'bold',
    },

    moderateButton: {
        height: 56,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    moderateButtonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Roboto',
    },

    retry2Text: {
        textAlign: 'center',
        marginTop: 22,
        color: '#A7942C',
        fontSize: 16,
    },

    disclaimer2: {
        marginTop: 'auto',
        marginBottom: 50,
        textAlign: 'center',
        color: '#A7942C',
        fontSize: 15,
    },

    lowContainer: {
        flex: 1,
        paddingTop: 20,
    },

    lowTopContainer: {
        alignItems: 'flex-end',
        paddingHorizontal: 30,
    },

    lowContent: {
        flex: 1,
        paddingHorizontal: 60,
    },

    warning3Icon: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 45,
        marginBottom: 45,
    },

    lowTitle: {
        color: '#61A72C',
        fontSize: 28,
        lineHeight: 38,
        marginBottom: 24,
        fontFamily: 'Roboto',
    },

    lowTitleBold: {
        fontWeight: 'bold',
    },

    lowDescription: {
        color: '#61A72C',
        fontSize: 15.6,
        lineHeight: 22,
        marginBottom: 50,
        fontFamily: 'Roboto',
    },

    lowDescriptionBold: {
        fontWeight: 'bold',
    },

    lowButton: {
        height: 56,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    lowButtonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Roboto',
    },

    retry3Text: {
        textAlign: 'center',
        marginTop: 22,
        color: '#61A72C',
        fontSize: 16,
    },

    disclaimer3: {
        marginTop: 'auto',
        marginBottom: 50,
        textAlign: 'center',
        color: '#61A72C',
        fontSize: 15,
    },

});