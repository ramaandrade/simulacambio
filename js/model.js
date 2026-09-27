/**
 * SimulaCâmbio — Modelo Econômico e Macroeconômico de Câmbio
 * Regras fundamentadas na legislação brasileira (Lei 14.286/2021, Resoluções CMN e BCB)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimulaCambioModel = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // Alíquotas e constantes regulatórias padrão do Brasil
  const REGULATORY_CONSTANTS = {
    // Alíquotas de IOF (Decreto nº 6.306/2007 e alterações)
    IOF_CASH: 0.0110,           // 1,10% em espécie / papel-moeda
    IOF_CARD: 0.0350,           // 3,50% em cartão de crédito/débito internacional (cronograma de redução)
    IOF_CARD_LEGACY: 0.0638,    // 6,38% histórico
    IOF_REMITTANCE_SAME: 0.0110,// 1,10% remessa para mesma titularidade (conta global própria)
    IOF_REMITTANCE_DIFF: 0.0038,// 0,38% remessa para titularidade diferente
    IOF_LOAN_EXT: 0.0000,       // 0,00% empréstimos externos longo prazo

    // Parâmetros de Reservas e Câmbio
    INITIAL_RESERVES: 355.0,    // US$ 355 bilhões (padrão Brasil recente)
    MIN_SAFE_RESERVES: 200.0,   // US$ 200 bilhões nível prudencial
    INITIAL_PTAX: 5.2000,       // R$ 5,2000 por US$ 1,00
    INITIAL_SELIC: 10.50,       // 10,50% ao ano
    INITIAL_FED_FUNDS: 5.25,    // 5,25% ao ano (EUA)
    INITIAL_CDS_BRAZIL: 210,    // 210 bps (Risco-País)
  };

  /**
   * Cálculo oficial do Valor Efetivo Total (VET)
   * Fórmula regulamentada pelo Banco Central do Brasil:
   * VET = (Moeda_Estrangeira * Taxa_Contratada + IOF + Tarifas) / Moeda_Estrangeira
   * 
   * @param {number} amountForex Quantidade em moeda estrangeira (ex: US$ 1000)
   * @param {number} baseRate Taxa comercial/PTAX base (ex: 5.20)
   * @param {number} spreadPercent Spread da instituição em % (ex: 1.5% -> 0.015)
   * @param {number} iofRate Alíquota de IOF (ex: 0.011 para 1.1%)
   * @param {number} fixedFee Tarifas administrativas fixas em R$ (ex: 20.00)
   * @returns {Object} Detalhamento dos custos e VET final por unidade
   */
  function calculateVET(amountForex, baseRate, spreadPercent, iofRate, fixedFee = 0) {
    if (amountForex <= 0 || baseRate <= 0) {
      throw new Error('Quantidade e taxa base devem ser maiores que zero.');
    }

    const contractedRate = baseRate * (1 + spreadPercent);
    const subtotalBRL = amountForex * contractedRate;
    const iofAmount = subtotalBRL * iofRate;
    const totalBRL = subtotalBRL + iofAmount + fixedFee;
    const vet = totalBRL / amountForex;
    const totalFeesAndSpread = totalBRL - (amountForex * baseRate);

    return {
      amountForex: Number(amountForex.toFixed(2)),
      baseRate: Number(baseRate.toFixed(4)),
      spreadPercent: Number((spreadPercent * 100).toFixed(2)),
      contractedRate: Number(contractedRate.toFixed(4)),
      subtotalBRL: Number(subtotalBRL.toFixed(2)),
      iofRatePercent: Number((iofRate * 100).toFixed(2)),
      iofAmount: Number(iofAmount.toFixed(2)),
      fixedFee: Number(fixedFee.toFixed(2)),
      totalBRL: Number(totalBRL.toFixed(2)),
      vet: Number(vet.toFixed(4)),
      totalFeesAndSpread: Number(totalFeesAndSpread.toFixed(2)),
      effectiveExtraPercentage: Number((((vet / baseRate) - 1) * 100).toFixed(2))
    };
  }

  /**
   * Comparador completo de modalidades de turismo e remessa:
   * 1. Dinheiro em Espécie (Casa de Câmbio)
   * 2. Cartão de Crédito Internacional
   * 3. Conta Global / Remessa Digital (Fintech)
   */
  function compareFXModalities(amountForex, basePtax) {
    // Parâmetros médios praticados no mercado brasileiro
    const modalities = [
      {
        id: 'cash',
        name: 'Dólar em Espécie (Papel-moeda)',
        channel: 'Casa de Câmbio / Banco Tradicional',
        spreadPercent: 0.035, // 3,5% de spread físico (logística, custódia e segurança)
        iofRate: REGULATORY_CONSTANTS.IOF_CASH, // 1,10%
        fixedFee: 25.00, // Tarifa de balcão
        pros: 'Aceito em qualquer local físico; sem risco de oscilação futura após a compra.',
        cons: 'Risco de perda e roubo físico; spread cambial mais alto devido ao custo de transporte.',
        tag: 'Tradicional'
      },
      {
        id: 'card',
        name: 'Cartão de Crédito Internacional',
        channel: 'Bancos e Emissores de Cartão',
        spreadPercent: 0.050, // 5,0% de spread de conversão internacional
        iofRate: REGULATORY_CONSTANTS.IOF_CARD, // 3,50%
        fixedFee: 0.00,
        pros: 'Comodidade imediata, programas de milhas/pontos, seguro do cartão.',
        cons: 'IOF mais alto, spread bancário elevado e risco de cotação variar até o fechamento da fatura.',
        tag: 'Mais Seguro / Mais Caro'
      },
      {
        id: 'global_account',
        name: 'Conta Global / Remessa Digital',
        channel: 'Fintechs e Bancos Digitais (Marco Legal 14.286)',
        spreadPercent: 0.015, // 1,5% spread competitivo
        iofRate: REGULATORY_CONSTANTS.IOF_REMITTANCE_SAME, // 1,10%
        fixedFee: 0.00,
        pros: 'Menor VET geral, conversão em tempo real, cartão de débito internacional.',
        cons: 'Exige smartphone/aplicativo ativo; alguns estabelecimentos ainda exigem dinheiro em cédula.',
        tag: 'Econômico / Moderno'
      }
    ];

    const results = modalities.map(mod => {
      const vetData = calculateVET(amountForex, basePtax, mod.spreadPercent, mod.iofRate, mod.fixedFee);
      return {
        ...mod,
        vetData
      };
    });

    // Ordenar pelo menor total pago em BRL (melhor opção primeiro)
    results.sort((a, b) => a.vetData.totalBRL - b.vetData.totalBRL);
    const bestTotal = results[0].vetData.totalBRL;

    results.forEach((item, index) => {
      item.rank = index + 1;
      item.differenceFromBest = Number((item.vetData.totalBRL - bestTotal).toFixed(2));
      item.isBest = index === 0;
    });

    return results;
  }

  /**
   * Cálculo do Cupom Cambial Onshore (Taxa de juros em dólares no Brasil)
   * Paridade Coberta de Taxas de Juros (CIP):
   * (1 + Selic) = (1 + Cupom) * (F / S)
   * Cupom ≈ [(1 + Selic) / (F / S)] - 1
   */
  function calculateCupomCambial(selicAnnualPercent, fedFundsPercent, countryRiskBps) {
    const riskFactor = countryRiskBps / 10000;
    // Em condições normais, cupom cambial reflete Fed Funds + Risco País + Prêmio de liquidez local
    const cupom = fedFundsPercent + (riskFactor * 100) + 0.35;
    return Number(cupom.toFixed(2));
  }

  /**
   * Mecânica de Hedge Corporativo para Importadora / Exportadora
   * Caso clássico: Importador precisa pagar US$ 500.000 em 90 dias
   */
  function evaluateCorporateHedge({
    companyType = 'importer', // 'importer' ou 'exporter'
    forexAmount = 500000,     // US$ 500.000
    initialPtax = 5.2000,
    finalPtax = 5.7500,       // Dólar subiu no vencimento
    strategy = 'unhedged',    // 'unhedged', 'hedge_100', 'hedge_50'
    forwardRate = 5.2650,     // Taxa a termo (PTAX + Cupom cambial de 90 dias)
    grossRevenueBRL = 4000000,// Receita bruta esperada em R$ (ex: venda de produtos no Brasil)
    otherCostsBRL = 800000    // Outros custos operacionais em R$
  }) {
    let effectiveFXCostBRL = 0;
    let hedgeGainLossBRL = 0;
    let forwardCostBRL = forexAmount * forwardRate;
    let spotCostFinalBRL = forexAmount * finalPtax;
    let spotCostInitialBRL = forexAmount * initialPtax;

    if (companyType === 'importer') {
      if (strategy === 'unhedged') {
        effectiveFXCostBRL = spotCostFinalBRL;
        hedgeGainLossBRL = 0;
      } else if (strategy === 'hedge_100') {
        // Custo travado na taxa a termo
        effectiveFXCostBRL = forwardCostBRL;
        // Ganho no derivativo = (Cotação Final - Cotação Forward) * Volume
        hedgeGainLossBRL = spotCostFinalBRL - forwardCostBRL;
      } else if (strategy === 'hedge_50') {
        const half = forexAmount * 0.5;
        effectiveFXCostBRL = (half * forwardRate) + (half * finalPtax);
        hedgeGainLossBRL = (half * finalPtax) - (half * forwardRate);
      }
    } else {
      // Exportador (recebe dólares)
      const forwardRevBRL = forexAmount * forwardRate;
      const spotRevFinalBRL = forexAmount * finalPtax;

      if (strategy === 'unhedged') {
        effectiveFXCostBRL = spotRevFinalBRL;
        hedgeGainLossBRL = 0;
      } else if (strategy === 'hedge_100') {
        effectiveFXCostBRL = forwardRevBRL;
        hedgeGainLossBRL = forwardRevBRL - spotRevFinalBRL;
      } else if (strategy === 'hedge_50') {
        const half = forexAmount * 0.5;
        effectiveFXCostBRL = (half * forwardRate) + (half * finalPtax);
        hedgeGainLossBRL = (half * forwardRate) - (half * finalPtax);
      }
    }

    // Impacto no DRE (Demonstração do Resultado do Exercício)
    const netProfitBRL = companyType === 'importer'
      ? grossRevenueBRL - effectiveFXCostBRL - otherCostsBRL
      : grossRevenueBRL + effectiveFXCostBRL - otherCostsBRL;

    const baselineNetProfitBRL = companyType === 'importer'
      ? grossRevenueBRL - spotCostInitialBRL - otherCostsBRL
      : grossRevenueBRL + spotCostInitialBRL - otherCostsBRL;

    const profitVarianceBRL = netProfitBRL - baselineNetProfitBRL;
    const profitMarginPercent = (netProfitBRL / grossRevenueBRL) * 100;

    return {
      companyType,
      forexAmount,
      initialPtax: Number(initialPtax.toFixed(4)),
      finalPtax: Number(finalPtax.toFixed(4)),
      forwardRate: Number(forwardRate.toFixed(4)),
      strategy,
      spotCostInitialBRL: Number(spotCostInitialBRL.toFixed(2)),
      spotCostFinalBRL: Number(spotCostFinalBRL.toFixed(2)),
      forwardCostBRL: Number(forwardCostBRL.toFixed(2)),
      effectiveFXCostBRL: Number(effectiveFXCostBRL.toFixed(2)),
      hedgeGainLossBRL: Number(hedgeGainLossBRL.toFixed(2)),
      grossRevenueBRL: Number(grossRevenueBRL.toFixed(2)),
      otherCostsBRL: Number(otherCostsBRL.toFixed(2)),
      netProfitBRL: Number(netProfitBRL.toFixed(2)),
      baselineNetProfitBRL: Number(baselineNetProfitBRL.toFixed(2)),
      profitVarianceBRL: Number(profitVarianceBRL.toFixed(2)),
      profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
      hasLoss: netProfitBRL < 0,
      balanceSheetRisk: strategy === 'unhedged' ? 'Alto (Descasamento Cambial Crítico)' : (strategy === 'hedge_50' ? 'Moderado' : 'Mínimo (Travado)')
    };
  }

  /**
   * Estado Global e Simulador da Mesa do Banco Central (BCB)
   */
  class CentralBankDeskSimulator {
    constructor(config = {}) {
      this.initialReserves = config.reserves || REGULATORY_CONSTANTS.INITIAL_RESERVES;
      this.reserves = this.initialReserves;
      this.ptax = config.ptax || REGULATORY_CONSTANTS.INITIAL_PTAX;
      this.baseEquilibriumPtax = this.ptax;
      this.selic = config.selic || REGULATORY_CONSTANTS.INITIAL_SELIC;
      this.fedFunds = config.fedFunds || REGULATORY_CONSTANTS.INITIAL_FED_FUNDS;
      this.countryRisk = config.countryRisk || REGULATORY_CONSTANTS.INITIAL_CDS_BRAZIL;
      this.cupomCambial = calculateCupomCambial(this.selic, this.fedFunds, this.countryRisk);
      this.volatility = config.volatility || 14.5; // Volatilidade anualizada em %
      this.dxy = 104.2;

      // Fluxo cambial (em milhões de US$)
      this.commercialFlow = 250;  // Superávit comercial do período
      this.financialFlow = -450;  // Saída líquida de capitais
      this.netFlow = this.commercialFlow + this.financialFlow;

      // Posição líquida do BCB em Swaps (em US$ bilhões)
      this.swapPosition = 15.0; // Posição vendida em dólar futuro

      // Linhas com recompra ativas (em US$ bilhões)
      this.lineAuctionsOutstanding = 0.0;

      // Histórico de rodadas/turnos
      this.turn = 1;
      this.history = [{
        turn: 1,
        ptax: this.ptax,
        reserves: this.reserves,
        swapPosition: this.swapPosition,
        lineAuctions: this.lineAuctionsOutstanding,
        intervention: 'Início da Gestão',
        interventionType: 'none',
        volume: 0,
        netFlow: this.netFlow,
        volatility: this.volatility,
        rationale: 'Início da série temporal da Mesa de Câmbio do BCB.'
      }];

      // Pontuação e métricas pedagógicas
      this.stabilityScore = 80;
      this.reservePrudenceScore = 90;
      this.totalInterventions = 0;
      this.releases = [];
    }

    /**
     * Aplica uma intervenção do Banco Central
     * @param {string} type Tipo de intervenção: 'swap_traditional', 'swap_reverse', 'direct_sale', 'line_auction', 'let_float'
     * @param {number} volume Volume da intervenção (em US$ Bilhões)
     */
    executeIntervention(type, volume = 1.0, marketContext = null) {
      this.turn += 1;
      let ptaxChange = 0;
      let reserveChange = 0;
      let swapChange = 0;
      let lineChange = 0;
      let interventionLabel = '';
      let rationale = '';

      switch (type) {
        case 'swap_traditional':
          // Swap Tradicional: Vende dólares futuros (oferece hedge sintético)
          // Não impacta reservas físicas imediatas!
          // Reduz a demanda no mercado à vista e no futuro, aliviando a PTAX
          swapChange = volume;
          this.swapPosition += swapChange;
          // Impacto na PTAX: alívio moderado a forte dependendo do volume
          ptaxChange = -0.045 * (volume / 1.0);
          this.volatility = Math.max(8.0, this.volatility - 1.8 * volume);
          interventionLabel = `Swap Cambial Tradicional (US$ ${volume.toFixed(1)} bi)`;
          rationale = 'Fornecimento de hedge cambial ao mercado financeiro sem desembolso de reservas físicas internacionais. Atende à demanda por proteção e desacelera a alta do dólar futuro.';
          break;

        case 'swap_reverse':
          // Swap Reverso: Compra dólares futuros (quando o dólar está caindo demais e o real valorizado)
          swapChange = -volume;
          this.swapPosition = Math.max(0, this.swapPosition + swapChange);
          ptaxChange = +0.035 * (volume / 1.0);
          interventionLabel = `Swap Cambial Reverso (US$ ${volume.toFixed(1)} bi)`;
          rationale = 'Compra de dólar sintético para conter valorização desordenada do Real e recompor exposição cambial.';
          break;

        case 'direct_sale':
          // Venda Direta à Vista de Reservas:
          // Vende dólares físicos das reservas internacionais.
          // Choque de oferta direto no mercado à vista, derruba a PTAX com força, mas QUEIMA reservas!
          if (this.reserves - volume < 50) {
            throw new Error('Nível crítico de reservas! Intervenção à vista bloqueada por risco soberano.');
          }
          reserveChange = -volume;
          this.reserves += reserveChange;
          ptaxChange = -0.075 * (volume / 1.0);
          this.volatility = Math.max(8.0, this.volatility - 2.5 * volume);
          interventionLabel = `Venda Direta de Reservas à Vista (US$ ${volume.toFixed(1)} bi)`;
          rationale = 'Injeção maciça de moeda física no mercado à vista interbancário para estancar falta de liquidez imediata. Atenção: reduziu o estoque de reservas soberanas.';
          break;

        case 'line_auction':
          // Leilão de Linha com Compromisso de Recompra:
          // Empréstimo transitório de dólares das reservas para bancos/exportadores.
          // Reservas baixam temporariamente ou ficam alocadas em compromissadas, e retornam no futuro com juros.
          lineChange = volume;
          this.lineAuctionsOutstanding += lineChange;
          // Redução temporária de reservas alocadas
          reserveChange = -volume * 0.5; // apenas alocação garantida
          this.reserves += reserveChange;
          ptaxChange = -0.040 * (volume / 1.0);
          interventionLabel = `Leilão de Linha c/ Recompra (US$ ${volume.toFixed(1)} bi)`;
          rationale = 'Provisão de liquidez temporária em moeda estrangeira com data de retorno pré-fixada. Estabiliza o crédito externo para importadores e exportadores.';
          break;

        case 'let_float':
        default:
          type = 'let_float';
          volume = 0;
          interventionLabel = 'Deixar Flutuar Livremente (Sem Intervenção)';
          // Mercado oscila pelas forças espontâneas e pelo fluxo líquido
          ptaxChange = (this.netFlow < 0 ? +0.065 : -0.035);
          this.volatility = Math.min(35.0, this.volatility + 1.2);
          rationale = 'Respeito ao regime de Câmbio Flutuante Sujo (Tripé Macroeconômico), absorvendo os choques externos sem comprometer o balanço do BCB.';
          break;
      }

      // Se houver choque de mercado externo na rodada
      if (marketContext) {
        if (marketContext.ptaxShock) ptaxChange += marketContext.ptaxShock;
        if (marketContext.netFlowDelta) this.netFlow += marketContext.netFlowDelta;
        if (marketContext.volatilityShock) this.volatility += marketContext.volatilityShock;
        if (marketContext.dxyChange) this.dxy += marketContext.dxyChange;
        if (marketContext.riskChange) this.countryRisk += marketContext.riskChange;
      }

      // Ruído estocástico de mercado
      const marketNoise = (Math.random() - 0.48) * 0.03;
      this.ptax = Math.max(2.5, Number((this.ptax + ptaxChange + marketNoise).toFixed(4)));
      this.cupomCambial = calculateCupomCambial(this.selic, this.fedFunds, this.countryRisk);

      // Atualizar métricas pedagógicas
      this.updatePedagogicalScores(type, volume);

      const record = {
        turn: this.turn,
        ptax: this.ptax,
        reserves: Number(this.reserves.toFixed(2)),
        swapPosition: Number(this.swapPosition.toFixed(2)),
        lineAuctions: Number(this.lineAuctionsOutstanding.toFixed(2)),
        intervention: interventionLabel,
        interventionType: type,
        volume: Number(volume.toFixed(2)),
        netFlow: Number(this.netFlow.toFixed(2)),
        volatility: Number(this.volatility.toFixed(2)),
        rationale
      };

      this.history.push(record);

      // Gerar Comunicado Oficial do BCB
      const release = this.generateOfficialRelease(record);
      this.releases.unshift(release);

      return record;
    }

    updatePedagogicalScores(type, volume) {
      this.totalInterventions += (type === 'let_float' ? 0 : 1);

      // Penalizar se queimar reservas excessivamente
      if (this.reserves < 280) {
        this.reservePrudenceScore = Math.max(20, this.reservePrudenceScore - 8);
      } else if (this.reserves >= 330) {
        this.reservePrudenceScore = Math.min(100, this.reservePrudenceScore + 2);
      }

      // Avaliar estabilidade: PTAX excessivamente volátil reduz nota
      if (this.volatility > 22.0) {
        this.stabilityScore = Math.max(30, this.stabilityScore - 5);
      } else if (this.volatility <= 16.0) {
        this.stabilityScore = Math.min(100, this.stabilityScore + 3);
      }
    }

    generateOfficialRelease(record) {
      const dateStr = new Date().toLocaleDateString('pt-BR');
      return {
        id: `BCB-REL-${this.turn}`,
        date: dateStr,
        turn: record.turn,
        title: `Comunicado da Diretoria de Política Monetária e Câmbio — Turno ${record.turn}`,
        ptax: record.ptax,
        reserves: record.reserves,
        action: record.intervention,
        text: `O Banco Central do Brasil informa que, no âmbito de suas atribuições legais e em conformidade com as diretrizes do regime de Câmbio Flutuante, realizou operação de "${record.intervention}". A autoridade monetária reitera que suas atuações visam unicamente mitigar disfunções na liquidez e excesso de volatilidade, preservando a livre formação de preços do mercado cambial. Estoque atual de reservas internacionais soberanas em US$ ${record.reserves} bilhões.`
      };
    }
  }

  return {
    REGULATORY_CONSTANTS,
    calculateVET,
    compareFXModalities,
    calculateCupomCambial,
    evaluateCorporateHedge,
    CentralBankDeskSimulator
  };
});
