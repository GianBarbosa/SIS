import triageRepository from "../repositories/triageRepository";

const triageRepo = triageRepository();

const triageData = {
    phase1: null,
    phase2: null,
    phase3: null
}

let currentRiskDegree = 0

async function getPhase1TriageData() {
    triageData.phase1 = await triageRepo.getPhase1TriageData();
    return triageData.phase1;
}

async function getPhase2TriageData() {
    triageData.phase2 = await triageRepo.getPhase2TriageData();
    return triageData.phase2;
}

async function getPhase3TriageData() {
    triageData.phase3 = await triageRepo.getPhase3TriageData();
    return triageData.phase3;
}

function toNode(phase, nodeId) {
    switch (phase) {
        case 1:
            return triageData.phase1.find(node => node.id === nodeId);
        case 2:
            return triageData.phase2.find(node => node.id === nodeId);
        case 3:
            return triageData.phase3.find(node => node.id === nodeId);
        default:
            throw new Error('Invalid phase');
    }
}

async function startPhase1() {
    getPhase2TriageData();
    getPhase3TriageData();
    await getPhase1TriageData();
    return triageData.phase1[0];
}

function startPhase2() {
    currentRiskDegree = 0;
    return triageData.phase2[0];
}

function startPhase3(ageGroup) {
    switch (ageGroup) {
        case 'baby':
            currentRiskDegree += 3;
            break;
        case 'elderly':
            currentRiskDegree += 2;
            break;
        case 'late-elderly':
            currentRiskDegree += 3;
            break;
        default:
            break;
    }

    if (currentRiskDegree >= 14) {
        return { riskDegree: 'EMERGENCY' };
    }
    
    return triageData.phase3[0];
}

function nextNode(phase, currentNode, answer) {
    switch (phase) {
        case 1: {
            const nextNodeId = currentNode.next
            if (nextNodeId === null) {
                return {node: null};
            }
            return { node : toNode(1, nextNodeId)};
        }
        case 2: {
            const nextNodeId = answer === 'positive' ?
                currentNode.nextPositive :
                currentNode.nextNegative;
            if (nextNodeId === null) {
                const defaultRisk = currentNode.baseRiskDegree ?? 0;
                currentRiskDegree = answer === 'positive'
                    ? (currentNode.baseRiskPositive ?? defaultRisk)
                    : (currentNode.baseRiskNegative ?? defaultRisk);

                if (currentRiskDegree === 0) {
                    return { riskDegree: 'NONE' };
                }

                if (currentRiskDegree >= 14) {
                    return { riskDegree: 'EMERGENCY' };
                }
                return {node: null}
            }
            return {node : toNode(2, nextNodeId)};
        }
        case 3: {
            if (answer === 'positive') {
                currentRiskDegree += currentNode.riskDegreeIncrease;
            }

            if (currentRiskDegree >= 14) {
                return { riskDegree: 'EMERGENCY' };
            }

            const nextNodeId = answer === 'positive' ?
                currentNode.nextPositive :
                currentNode.nextNegative;

            if (nextNodeId === null) {
                const riskDegree =
                    currentRiskDegree <= 1 ? 'NONE' :
                    currentRiskDegree <= 4 ? 'LOW' :
                    currentRiskDegree <= 9 ? 'MODERATE' :
                    currentRiskDegree < 14 ? 'HIGH' :
                    'EMERGENCY'

                return { riskDegree: riskDegree };
            }
            return { node : toNode(3, nextNodeId) };
        }

        default:
            throw new Error('Invalid phase');
    }
}

export default { startPhase1, startPhase2, startPhase3, nextNode }