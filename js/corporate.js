/**
 * SimulaCâmbio — Mesa Corporativa e Análise de Risco Cambial
 * Cenário de Comércio Exterior, Proteção Cambial (Hedge) e o Efeito Balanço
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./model'));
  } else {
    root.SimulaCambioCorporate = factory(root.SimulaCambioModel);
  }
})(typeof self !== 'undefined' ? self : this, function (Model) {

  // Perfil da Empresa Simulada
  const DEFAULT_COMPANY_STATE = {
    name: 'BrasilTech Manufatura e Comércio Exterior S/A',
    segment: 'Eletrônicos e Bens de Capital',
    currency: 'BRL',
    orderForexUSD: 500000,          // Compra de US$ 500.000 em insumos
    daysToMaturity: 90,             // Pagamento a fornecedor em 90 dias
    spotInitialPtax: 5.2000,        // PTAX no dia do fechamento do pedido
    forwardPtax: 5.2750,            // Cotação futura travada via Contratos Futuros B3 (WDO)
    expectedFinalPtax: 5.8500,      // Cenário de estresse: dólar sobe para R$ 5,85
    domesticRevenueBRL: 4200000,    // Receita bruta projetada na venda dos produtos acabados
    localCostsBRL: 950000,          // Salários, logística e impostos locais
    strategy: 'unhedged'            // 'unhedged', 'hedge_100', 'hedge_50'
  };

  /**
   * Calcula o resultado contábil e financeiro corporativo sob diferentes cenários
   */
  function simulateCorporatePerformance(params = {}) {
    const data = Object.assign({}, DEFAULT_COMPANY_STATE, params);

    const calculation = Model.evaluateCorporateHedge({
      companyType: 'importer',
      forexAmount: data.orderForexUSD,
      initialPtax: data.spotInitialPtax,
      finalPtax: data.expectedFinalPtax,
      strategy: data.strategy,
      forwardRate: data.forwardPtax,
      grossRevenueBRL: data.domesticRevenueBRL,
      otherCostsBRL: data.localCostsBRL
    });

    // Comparativo simultâneo de todas as 3 estratégias
    const strategyUnhedged = Model.evaluateCorporateHedge({
      companyType: 'importer',
      forexAmount: data.orderForexUSD,
      initialPtax: data.spotInitialPtax,
      finalPtax: data.expectedFinalPtax,
      strategy: 'unhedged',
      forwardRate: data.forwardPtax,
      grossRevenueBRL: data.domesticRevenueBRL,
      otherCostsBRL: data.localCostsBRL
    });

    const strategyHedge100 = Model.evaluateCorporateHedge({
      companyType: 'importer',
      forexAmount: data.orderForexUSD,
      initialPtax: data.spotInitialPtax,
      finalPtax: data.expectedFinalPtax,
      strategy: 'hedge_100',
      forwardRate: data.forwardPtax,
      grossRevenueBRL: data.domesticRevenueBRL,
      otherCostsBRL: data.localCostsBRL
    });

    const strategyHedge50 = Model.evaluateCorporateHedge({
      companyType: 'importer',
      forexAmount: data.orderForexUSD,
      initialPtax: data.spotInitialPtax,
      finalPtax: data.expectedFinalPtax,
      strategy: 'hedge_50',
      forwardRate: data.forwardPtax,
      grossRevenueBRL: data.domesticRevenueBRL,
      otherCostsBRL: data.localCostsBRL
    });

    // Diagnóstico pedagógico do Efeito Balanço
    let balanceSheetAnalysis = '';
    const fxVariationPct = ((data.expectedFinalPtax / data.spotInitialPtax) - 1) * 100;

    if (data.strategy === 'unhedged') {
      if (data.expectedFinalPtax > data.spotInitialPtax) {
        balanceSheetAnalysis = `ALERTA DE DESPASSO CAMBIAL: O dólar saltou +${fxVariationPct.toFixed(1)}%. Como a dívida com fornecedores externos não estava protegida, o custo dos insumos saltou de R$ ${calculation.spotCostInitialBRL.toLocaleString('pt-BR')} para R$ ${calculation.spotCostFinalBRL.toLocaleString('pt-BR')}, corroendo o lucro líquido em R$ ${Math.abs(calculation.profitVarianceBRL).toLocaleString('pt-BR')} e expondo a empresa ao risco de insolvência.`;
      } else {
        balanceSheetAnalysis = `GANHO ESPECULATIVO OCASIONAL: O dólar recuou ${fxVariationPct.toFixed(1)}%, gerando economia transitória nos insumos. Atenção pedagógica: deixar o passivo cambial sem hedge transforma a empresa fabril em um apostador cambial involuntário.`;
      }
    } else if (data.strategy === 'hedge_100') {
      balanceSheetAnalysis = `PREVISIBILIDADE E PROTEÇÃO DA MARGEM: A empresa travou o custo a R$ ${data.forwardPtax.toFixed(4)}. Mesmo com o dólar disparando para R$ ${data.expectedFinalPtax.toFixed(4)}, o ganho com os derivativos futuros compensou a alta à vista, garantindo lucro estável de R$ ${calculation.netProfitBRL.toLocaleString('pt-BR')} (Margem Líquida de ${calculation.profitMarginPercent}%).`;
    } else {
      balanceSheetAnalysis = `PROTEÇÃO PARCIAL: Metade do passivo cambial foi travado e a outra metade permaneceu exposta à volatilidade diária. Reduz pela metade o choque de caixa, mas mantém incerteza orçamentária.`;
    }

    return {
      params: data,
      current: calculation,
      comparative: {
        unhedged: strategyUnhedged,
        hedge_100: strategyHedge100,
        hedge_50: strategyHedge50
      },
      fxVariationPct: Number(fxVariationPct.toFixed(2)),
      balanceSheetAnalysis
    };
  }

  return {
    DEFAULT_COMPANY_STATE,
    simulateCorporatePerformance
  };
});
