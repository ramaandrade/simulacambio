/**
 * SimulaCâmbio — Suíte de Testes Automatizados de Validação Matemática e Regulatória
 * Execução com: node tests/simulation.test.js
 */

const assert = require('assert');
const Model = require('../js/model');
const BCB = require('../js/bcb');
const Corporate = require('../js/corporate');
const VET = require('../js/vet');
const Challenges = require('../js/challenges');
const Quiz = require('../js/quiz');

console.log('🧪 Iniciando testes automatizados do SimulaCâmbio...\n');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ [PASSOU] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FALHOU] ${name}`);
    console.error(`     Erro: ${err.message}`);
    failedTests++;
  }
}

// ---------------------------------------------------------
// 1. Testes de Cálculo do VET (Valor Efetivo Total)
// ---------------------------------------------------------
runTest('Cálculo oficial do VET com IOF e Spread', () => {
  const result = Model.calculateVET(1000, 5.20, 0.015, 0.011, 0);
  assert.strictEqual(result.amountForex, 1000);
  assert.strictEqual(result.baseRate, 5.2000);
  assert.strictEqual(result.contractedRate, 5.2780);
  assert.strictEqual(result.subtotalBRL, 5278.00);
  assert.strictEqual(result.iofAmount, 58.06);
  assert.strictEqual(result.totalBRL, 5336.06);
  assert.strictEqual(result.vet, 5.3361);
  assert(result.vet > result.contractedRate, 'VET deve ser superior à taxa contratada devido ao IOF');
});

runTest('VET inclui corretamente taxas administrativas fixas', () => {
  const resultWithFee = Model.calculateVET(1000, 5.00, 0.02, 0.011, 25.0);
  const resultWithoutFee = Model.calculateVET(1000, 5.00, 0.02, 0.011, 0.0);
  assert.strictEqual(resultWithFee.totalBRL, Number((resultWithoutFee.totalBRL + 25.0).toFixed(2)));
  assert(resultWithFee.vet > resultWithoutFee.vet);
});

// ---------------------------------------------------------
// 2. Comparativo de Modalidades de Turismo e Remessa
// ---------------------------------------------------------
runTest('Comparativo de modalidades: Conta Global mais econômica que Cartão de Crédito', () => {
  const comparison = Model.compareFXModalities(1000, 5.20);
  assert.strictEqual(comparison.length, 3);
  
  const globalAccount = comparison.find(m => m.id === 'global_account');
  const creditCard = comparison.find(m => m.id === 'card');
  
  assert(globalAccount.vetData.totalBRL < creditCard.vetData.totalBRL,
    'Conta Global deve ser mais barata que Cartão de Crédito devido ao IOF menor e spread enxuto');
  assert.strictEqual(comparison[0].id, 'global_account', 'Conta Global deve ser a 1ª colocada no ranking');
});

// ---------------------------------------------------------
// 3. Mesa do Banco Central e Mecânica de Intervenções
// ---------------------------------------------------------
runTest('Swap Cambial Tradicional: alivia PTAX sem queimar reservas soberanas', () => {
  const sim = new Model.CentralBankDeskSimulator({ reserves: 350.0, ptax: 5.30 });
  const initialReserves = sim.reserves;
  const initialPtax = sim.ptax;
  
  const record = sim.executeIntervention('swap_traditional', 1.5);
  
  assert.strictEqual(sim.reserves, initialReserves, 'Reservas físicas NÃO podem ser alteradas por swap sintético');
  assert(sim.swapPosition > 15.0, 'Posição vendida em swaps deve aumentar');
  assert(record.ptax < initialPtax, 'PTAX deve recuar com a oferta de hedge pelo BCB');
});

runTest('Venda Direta de Reservas à Vista: reduz PTAX e deduz reservas físicas', () => {
  const sim = new Model.CentralBankDeskSimulator({ reserves: 350.0, ptax: 5.40 });
  const initialReserves = sim.reserves;
  
  const record = sim.executeIntervention('direct_sale', 2.0);
  
  assert.strictEqual(sim.reserves, initialReserves - 2.0, 'Reservas devem sofrer baixa exata de US$ 2.0 bi');
  assert(record.ptax < 5.40, 'Venda direta deve causar choque de oferta e derrubar PTAX');
});

runTest('Leilão de Linha: registra operações com compromisso de recompra', () => {
  const sim = new Model.CentralBankDeskSimulator({ reserves: 350.0, ptax: 5.40 });
  const record = sim.executeIntervention('line_auction', 1.0);
  assert(sim.lineAuctionsOutstanding >= 1.0, 'Volume de leilão de linha pendente deve ser contabilizado');
});

// ---------------------------------------------------------
// 4. Mesa Corporativa: Hedge e Efeito Balanço
// ---------------------------------------------------------
runTest('Importadora: Hedge com futuros protege margem contra disparada cambial', () => {
  const unhedged = Model.evaluateCorporateHedge({
    companyType: 'importer',
    forexAmount: 500000,
    initialPtax: 5.00,
    finalPtax: 6.00, // Alta de 20%
    strategy: 'unhedged',
    forwardRate: 5.05,
    grossRevenueBRL: 4000000,
    otherCostsBRL: 800000
  });

  const hedged = Model.evaluateCorporateHedge({
    companyType: 'importer',
    forexAmount: 500000,
    initialPtax: 5.00,
    finalPtax: 6.00,
    strategy: 'hedge_100',
    forwardRate: 5.05,
    grossRevenueBRL: 4000000,
    otherCostsBRL: 800000
  });

  assert(hedged.netProfitBRL > unhedged.netProfitBRL, 'Estratégia protegida deve ter lucro líquido maior');
  assert.strictEqual(hedged.effectiveFXCostBRL, 500000 * 5.05, 'Custo do insumo deve ser rigorosamente travado');
  assert.strictEqual(unhedged.effectiveFXCostBRL, 500000 * 6.00, 'Empresa desprotegida absorve prejuízo do dólar à vista');
  assert(unhedged.profitVarianceBRL < 0, 'Variação do resultado deve ser severamente negativa na estratégia unhedged');
});

// ---------------------------------------------------------
// 5. Cenários Históricos e Motor de Crises
// ---------------------------------------------------------
runTest('Cenário Histórico de 1999: Transição para o Câmbio Flutuante gera pontuação positiva', () => {
  const runner = new Challenges.HistoricalChallengeRunner('crisis_1999');
  assert.strictEqual(runner.challenge.id, 'crisis_1999');
  
  const step1Result = runner.submitChoice('c1_abandon_anchor');
  assert(step1Result.stepResult.scoreDelta > 0, 'Abandono da âncora cambial deve ser premiado pedagogicamente');
  assert.strictEqual(step1Result.isFinished, false);

  const step2Result = runner.submitChoice('c2_adopt_triad');
  assert(step2Result.stepResult.scoreDelta > 0, 'Adoção do tripé macroeconômico deve ser premiada');
  assert.strictEqual(step2Result.isFinished, true);
  assert(step2Result.finalReport.finalScore >= 80, 'Pontuação final deve ser de aprovação com louvor');
});

// ---------------------------------------------------------
// 6. Quiz Pedagógico e Avaliação Formativa
// ---------------------------------------------------------
runTest('Quiz Engine: Correção de respostas e cálculo de porcentagem', () => {
  const quiz = new Quiz.QuizEngine();
  assert.strictEqual(quiz.questions.length, 10, 'Quiz deve conter 10 questões');

  // Responder todas com a resposta correta
  quiz.questions.forEach(q => {
    quiz.recordAnswer(q.id, q.correctIndex);
  });

  const evaluation = quiz.evaluate();
  assert.strictEqual(evaluation.correctCount, 10);
  assert.strictEqual(evaluation.percentage, 100.0);
  assert.strictEqual(evaluation.badge, '🏆 Especialista Máximo em Política Cambial');
});

console.log(`\n====================================================`);
console.log(`📊 Resultado dos Testes: ${passedTests} aprovados | ${failedTests} falhas`);
console.log(`====================================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 Todos os testes de regras econômicas e financeiras passaram com sucesso!');
}
