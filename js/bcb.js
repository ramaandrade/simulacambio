/**
 * SimulaCâmbio — Mesa de Operações do Banco Central do Brasil (BCB)
 * Gerenciamento de intervenções, leilões, regime flutuante e comunicados de mercado
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./model'));
  } else {
    root.SimulaCambioBCB = factory(root.SimulaCambioModel);
  }
})(typeof self !== 'undefined' ? self : this, function (Model) {

  // Eventos de Mercado / Choques Macroeconômicos Disponíveis
  const MARKET_SCENARIOS = [
    {
      id: 'fed_hike',
      name: 'Choque de Juros nos EUA (Fed Tightening)',
      description: 'O Federal Reserve eleva juros em 50 bps. Saída de capitais de emergentes para títulos do Tesouro Americano (US Treasuries).',
      ptaxShock: +0.12,
      netFlowDelta: -600,
      volatilityShock: +4.5,
      dxyChange: +1.2,
      riskChange: +25,
      hint: 'O mercado busca proteção futura contra a valorização global da moeda americana. Swaps cambiais são a ferramenta ideal para conter a alta sem queimar reservas.'
    },
    {
      id: 'commodity_boom',
      name: 'Boom Global de Commodities Agrícolas',
      description: 'Preços da soja, milho e minério disparam. Entrada forte de dólares comerciais gerando pressão de valorização do Real.',
      ptaxShock: -0.15,
      netFlowDelta: +850,
      volatilityShock: -2.0,
      dxyChange: -0.8,
      riskChange: -30,
      hint: 'Com fluxo abundante de entrada comercial, o Real se valoriza. Se a valorização for desordenada, o BCB pode avaliar Swaps Reversos ou deixar flutuar.'
    },
    {
      id: 'domestic_fiscal_crisis',
      name: 'Turbulência Fiscal Doméstica & Ruído Político',
      description: 'Incertezas quanto à trajetória da dívida pública brasileira elevam o prêmio de risco-país (CDS). Investidores realizam remessas ao exterior.',
      ptaxShock: +0.18,
      netFlowDelta: -750,
      volatilityShock: +6.0,
      dxyChange: 0,
      riskChange: +55,
      hint: 'O aumento do risco soberano pressiona a cotação. O BCB deve atuar para evitar volatilidade disfuncional, mas reconhecer que o câmbio flutuante é a primeira linha de absorção do choque.'
    },
    {
      id: 'global_liquidity_squeeze',
      name: 'Escassez Aguda de Liquidez em Dólares (Credit Crunch)',
      description: 'Bancos internacionais fecham linhas de crédito externo para comércio exterior (Adiantamento sobre Contratos de Câmbio - ACC). Falta dólar físico à vista.',
      ptaxShock: +0.22,
      netFlowDelta: -900,
      volatilityShock: +8.0,
      dxyChange: +1.8,
      riskChange: +45,
      hint: 'Há escassez aguda de moeda física no mercado à vista. Leilões de Linha com recompra ou Venda Direta de Reservas são os únicos instrumentos capazes de irrigar o sistema físico.'
    },
    {
      id: 'calm_market',
      name: 'Estabilidade Macroeconômica & Fluxo Equilibrado',
      description: 'Mercados internacionais calmos, inflação comportada e fluxo cambial próximo da neutralidade.',
      ptaxShock: -0.01,
      netFlowDelta: +50,
      volatilityShock: -1.5,
      dxyChange: 0,
      riskChange: -10,
      hint: 'Ambiente propício para deixar o câmbio flutuar espontaneamente, sem intervenção estatal.'
    }
  ];

  class BCBDeskManager {
    constructor() {
      this.simulator = new Model.CentralBankDeskSimulator();
      this.currentScenarioIndex = 0;
      this.pendingScenario = null;
    }

    reset() {
      this.simulator = new Model.CentralBankDeskSimulator();
      this.currentScenarioIndex = 0;
      this.pendingScenario = null;
      return this.getState();
    }

    triggerScenario(scenarioId) {
      const scenario = MARKET_SCENARIOS.find(s => s.id === scenarioId);
      if (scenario) {
        this.pendingScenario = scenario;
      }
      return scenario;
    }

    getRandomScenario() {
      const randomIndex = Math.floor(Math.random() * MARKET_SCENARIOS.length);
      return MARKET_SCENARIOS[randomIndex];
    }

    executeTurn(interventionType, volume = 1.0) {
      const context = this.pendingScenario;
      const record = this.simulator.executeIntervention(interventionType, volume, context);
      
      // Limpar cenário pendente após execução
      const appliedScenario = this.pendingScenario;
      this.pendingScenario = null;

      return {
        record,
        appliedScenario,
        state: this.getState()
      };
    }

    getState() {
      return {
        turn: this.simulator.turn,
        ptax: this.simulator.ptax,
        reserves: this.simulator.reserves,
        initialReserves: this.simulator.initialReserves,
        swapPosition: this.simulator.swapPosition,
        lineAuctions: this.simulator.lineAuctionsOutstanding,
        selic: this.simulator.selic,
        fedFunds: this.simulator.fedFunds,
        countryRisk: this.simulator.countryRisk,
        cupomCambial: this.simulator.cupomCambial,
        volatility: this.simulator.volatility,
        dxy: this.simulator.dxy,
        netFlow: this.simulator.netFlow,
        commercialFlow: this.simulator.commercialFlow,
        financialFlow: this.simulator.financialFlow,
        history: this.simulator.history,
        releases: this.simulator.releases,
        stabilityScore: this.simulator.stabilityScore,
        reservePrudenceScore: this.simulator.reservePrudenceScore,
        totalInterventions: this.simulator.totalInterventions,
        pendingScenario: this.pendingScenario
      };
    }
  }

  return {
    MARKET_SCENARIOS,
    BCBDeskManager
  };
});
