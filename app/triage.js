import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import triageService from '../src/services/triageService';

export default function TriageRoute() {
    const [currentNode, setCurrentNode] = useState(null);
    const [showPhase3PreChoice, setShowPhase3PreChoice] = useState(false);
    const [riskDegree, setRiskDegree] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const phase = useRef(null);

    async function start() {
        setIsLoading(true);
        try {
            setCurrentNode(await triageService.startPhase1())
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
            setCurrentNode(null)
            setShowPhase3PreChoice(true);
            phase.current = 3;
        } else {
            setCurrentNode(null);
        }
    }

    async function handlePhase3PreChoice(ageGroup) {
        setCurrentNode(await triageService.startPhase3(ageGroup))
        setShowPhase3PreChoice(false);
    }

    useEffect(() => {
        start();
    }, [])


    const statusText = isLoading
        ? 'Carregando triagem...'
        : currentNode
            ? currentNode.question
            : showPhase3PreChoice
                ? 'Selecione a faixa etária para continuar'
                : 'Triagem completa!';

    return (
        <View>
            {isLoading && <ActivityIndicator size="small" />}
            <Text>
                {statusText}
            </Text>
            {currentNode && (
                <View>
                    <TouchableOpacity onPress={() => handleChoice(true)}>
                        <Text>
                            Yes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleChoice(false)}>
                        <Text>
                            No
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {showPhase3PreChoice && (
                <View>
                    <Text>
                        Qual a faixa etária do paciente?
                    </Text>
                    <TouchableOpacity onPress={() => handlePhase3PreChoice('baby')}>
                        <Text>
                            Bebê (0-1 anos)
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePhase3PreChoice('adult')}>
                        <Text>
                            Jovem/Adulto (2-59 anos)
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePhase3PreChoice('elderly')}>
                        <Text>
                            Idoso (60-75 anos)
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePhase3PreChoice('late-elderly')}>
                        <Text>
                            Idoso (75+ anos)
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            
            {riskDegree && (
                <Text>
                    Grau de risco: {riskDegree}
                </Text>
            )}
        </View>
    );
}