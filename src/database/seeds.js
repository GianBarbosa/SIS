export const healthUnitSeeds = [
  {
    nome: 'UPA Boa Viagem',
    type: 'URGENT_CARE',
    addressStreet: 'Av. Conselheiro Aguiar, 2000',
    addressCity: 'Recife',
    addressState: 'PE',
    addressZip: '51020-020',
    locationLat: -8.1168,
    locationLng: -34.8986,
    services: 'triagem,clinica geral,medicacao',
    phone: '(81) 3000-1000',
    openingHours: '24h'
  },
  {
    nome: 'UBS Casa Amarela',
    type: 'PRIMARY_CARE',
    addressStreet: 'Av. Norte Miguel Arraes, 3500',
    addressCity: 'Recife',
    addressState: 'PE',
    addressZip: '52070-000',
    locationLat: -8.0264,
    locationLng: -34.9186,
    services: 'vacina,consultas,puericultura',
    phone: '(81) 3000-2000',
    openingHours: 'Seg-Sex 07:00-19:00'
  },
  {
    nome: 'UPA Prazeres',
    type: 'URGENT_CARE',
    addressStreet: 'Av. Barreto de Menezes, 1500',
    addressCity: 'Jaboatao dos Guararapes',
    addressState: 'PE',
    addressZip: '54330-000',
    locationLat: -8.1684,
    locationLng: -34.9201,
    services: 'triagem,urgencia,medicacao',
    phone: '(81) 3000-3000',
    openingHours: '24h'
  },
  {
    nome: 'UBS Cajueiro Seco',
    type: 'PRIMARY_CARE',
    addressStreet: 'Av. General Manoel Rabelo, 500',
    addressCity: 'Jaboatao dos Guararapes',
    addressState: 'PE',
    addressZip: '54325-000',
    locationLat: -8.1952,
    locationLng: -34.9378,
    services: 'vacina,consultas,acompanhamento',
    phone: '(81) 3000-4000',
    openingHours: 'Seg-Sex 07:00-17:00'
  }
];

export const triagePhase1Seeds = [
  { id: 'A', question: 'Tem dificuldade grave para respirar?', next: 'B' },
  { id: 'B', question: 'Tem dor forte no peito agora?', next: 'C' },
  { id: 'C', question: 'Tem fraqueza em um lado do corpo?', next: 'D' },
  { id: 'D', question: 'Desmaiou ou perdeu consciencia?', next: 'E' },
  { id: 'E', question: 'Esta confuso ou desorientado?', next: 'F' },
  { id: 'F', question: 'Tosse com sangue?', next: null }
];

export const triagePhase2Seeds = [
  { id: 'G', question: 'Sintomas comecaram de forma subita?', nextPositive: 'H', nextNegative: 'I', baseRiskDegree: 0 },
  { id: 'H', question: 'Os sintomas estao piorando rapidamente?', nextPositive: null, nextNegative: 'I', baseRiskDegree: 0, baseRiskPositive: 10 },
  { id: 'I', question: 'Tem tosse ou falta de ar?', nextPositive: 'R1', nextNegative: 'J', baseRiskDegree: 0 },
  { id: 'R1', question: 'Falta de ar em repouso?', nextPositive: null, nextNegative: 'R2', baseRiskDegree: 0, baseRiskPositive: 10 },
  { id: 'R2', question: 'Tem febre?', nextPositive: 'R3', nextNegative: 'R4', baseRiskDegree: 0 },
  { id: 'R3', question: 'Tosse produtiva?', nextPositive: null, nextNegative: 'R4', baseRiskDegree: 0, baseRiskPositive: 5 },
  { id: 'R4', question: 'Tem chiado no peito?', nextPositive: 'R5', nextNegative: null, baseRiskDegree: 0, baseRiskNegative: 2 },
  { id: 'R5', question: 'Tem historico de asma ou DPOC?', nextPositive: null, nextNegative: null, baseRiskDegree: 0, baseRiskPositive: 5, baseRiskNegative: 2 },
  { id: 'J', question: 'Tem dor no peito?', nextPositive: 'C1', nextNegative: 'K', baseRiskDegree: 0 },
  { id: 'C1', question: 'Dor em aperto ou pressao?', nextPositive: 'C2', nextNegative: 'C3', baseRiskDegree: 0 },
  { id: 'C2', question: 'Irradia para braco ou pescoco?', nextPositive: null, nextNegative: null, baseRiskDegree: 0, baseRiskPositive: 10, baseRiskNegative: 5 },
  { id: 'C3', question: 'Piora ao respirar ou mexer?', nextPositive: null, nextNegative: null, baseRiskDegree: 0, baseRiskPositive: 2, baseRiskNegative: 5 },
  { id: 'K', question: 'Tem tontura ou fraqueza?', nextPositive: 'N1', nextNegative: 'L', baseRiskDegree: 0 },
  { id: 'N1', question: 'Perdeu a consciencia?', nextPositive: null, nextNegative: null, baseRiskDegree: 0, baseRiskPositive: 10, baseRiskNegative: 5 },
  { id: 'L', question: 'Tem dor abdominal?', nextPositive: 'A1', nextNegative: 'M', baseRiskDegree: 0 },
  { id: 'A1', question: 'Dor intensa e continua?', nextPositive: 'A2', nextNegative: 'A3', baseRiskDegree: 0 },
  { id: 'A2', question: 'Tem febre ou vomitos?', nextPositive: null, nextNegative: null, baseRiskDegree: 0, baseRiskPositive: 10, baseRiskNegative: 5 },
  { id: 'A3', question: 'Tem diarreia?', nextPositive: null, nextNegative: null, baseRiskDegree: 0, baseRiskPositive: 2, baseRiskNegative: 2 },
  { id: 'M', question: 'Tem algum sintoma?', nextPositive: null, nextNegative: null, baseRiskDegree: 0, baseRiskPositive: 1, baseRiskNegative: 0 }
];

export const triagePhase3Seeds = [
  { id: 'MAIN1', question: 'Tem alguma comorbidade?', nextPositive: 'COM1', nextNegative: 'MAIN2', riskDegreeIncrease: 0 },
  { id: 'COM1', question: 'Tem diabetes?', nextPositive: 'COM2', nextNegative: 'COM2', riskDegreeIncrease: 1 },
  { id: 'COM2', question: 'Tem hipertensao?', nextPositive: 'COM3', nextNegative: 'COM3', riskDegreeIncrease: 1 },
  { id: 'COM3', question: 'Tem doenca cardiaca?', nextPositive: 'COM4', nextNegative: 'COM4', riskDegreeIncrease: 2 },
  { id: 'COM4', question: 'Tem doenca pulmonar?', nextPositive: 'COM5', nextNegative: 'COM5', riskDegreeIncrease: 2 },
  { id: 'COM5', question: 'Tem cancer?', nextPositive: 'COM6', nextNegative: 'COM6', riskDegreeIncrease: 2 },
  { id: 'COM6', question: 'Eh imunossuprimido?', nextPositive: 'MAIN2', nextNegative: 'MAIN2', riskDegreeIncrease: 2 },
  { id: 'MAIN2', question: 'Faz uso de alguma medicacao?', nextPositive: 'MED1', nextNegative: 'MAIN3', riskDegreeIncrease: 0 },
  { id: 'MED1', question: 'Usa anticoagulante?', nextPositive: 'MED2', nextNegative: 'MED2', riskDegreeIncrease: 2 },
  { id: 'MED2', question: 'Toma insulina?', nextPositive: 'MED3', nextNegative: 'MED3', riskDegreeIncrease: 1 },
  { id: 'MED3', question: 'Usa corticoide cronico?', nextPositive: 'MED4', nextNegative: 'MED4', riskDegreeIncrease: 1 },
  { id: 'MED4', question: 'Faz quimioterapia?', nextPositive: 'MAIN3', nextNegative: 'MAIN3', riskDegreeIncrease: 2 },
  { id: 'MAIN3', question: 'Os sintomas comecaram ha mais de 3 dias?', nextPositive: 'MAIN4', nextNegative: 'MAIN4', riskDegreeIncrease: 1 },
  { id: 'MAIN4', question: 'Os sintomas apareceram de forma subita?', nextPositive: 'MAIN5', nextNegative: 'MAIN5', riskDegreeIncrease: 2 },
  { id: 'MAIN5', question: 'Os sintomas estao piorando progressivamente?', nextPositive: null, nextNegative: null, riskDegreeIncrease: 2 }
];
