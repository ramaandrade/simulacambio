/**
 * SimulaCâmbio — Desafios Históricos e Crises Cambiais da Economia Brasileira
 * Reconstituição de episódios reais: 1999, 2008, 2020 e Fed Tightening
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimulaCambioChallenges = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const HISTORICAL_CHALLENGES = [
    {
      id: 'crisis_1999',
      year: '1999',
      title: '1999: O Fim da Âncora Cambial e a Transição para o Tripé Macroeconômico',
      subtitle: 'Ataque especulativo, queima de reservas e a libertação do câmbio',
      badge: '🏛️ Arquiteto do Tripé',
      initialState: {
        ptax: 1.2100,
        reserves: 36.0, // Reservas em nível crítico após a crise russa
        volatility: 28.0,
        netFlow: -1200,
        regime: 'Bandas Cambiais (Câmbio Quase-Fixo)'
      },
      story: 'Estamos em janeiro de 1999. Após a crise asiática (1997) e a moratória russa (1998), investidores globais retiram bilhões de dólares do Brasil. O BCB tentou sustentar o Real vendendo reservas e elevando a taxa básica de juros a mais de 40% a.a., mas as reservas caíram pela metade. A âncora cambial do Plano Real tornou-se insustentável.',
      steps: [
        {
          round: 1,
          eventTitle: 'Ataque Especulativo em Massa no Mercado à Vista',
          eventDescription: 'Investidores exigem comprar US$ 2 bilhões por dia para enviar ao exterior. Se o BCB insistir em vender reservas para segurar a taxa fixa, as reservas irão a zero em 15 dias.',
          choices: [
            {
              id: 'c1_defend_fixed',
              text: 'Insistir na defesa do Câmbio Fixo vendendo US$ 3 bi de reservas à vista.',
              ptaxDelta: +0.02,
              reservesDelta: -3.0,
              volatilityDelta: +5.0,
              feedback: 'ERRO HISTÓRICO: Queimar reservas para defender paridade artificial alimenta o pânico especulativo e esgota os cofres soberanos do país.',
              scoreDelta: -25
            },
            {
              id: 'c1_abandon_anchor',
              text: 'Adotar o Câmbio Flutuante: Deixar o dólar encontrar o equilíbrio de mercado e preservar as reservas remanescentes.',
              ptaxDelta: +0.65,
              reservesDelta: 0.0,
              volatilityDelta: -6.0,
              feedback: 'DECISÃO CORRETA (Marco Histórico): Em 15 de janeiro de 1999, o Brasil adotou o câmbio flutuante. O dólar subiu a curto prazo, mas as reservas foram salvas e a economia encontrou novo equilíbrio.',
              scoreDelta: +40
            }
          ]
        },
        {
          round: 2,
          eventTitle: 'Consolidação Institucional: O Nascimento do Tripé Macroeconômico',
          eventDescription: 'Com o câmbio flutuante adotado, o Brasil precisa de uma nova âncora nominal para conter a inflação sem depender da taxa de câmbio fixa.',
          choices: [
            {
              id: 'c2_adopt_triad',
              text: 'Instituir o Tripé Macroeconômico: Metas de Inflação + Câmbio Flutuante + Metas Fiscais.',
              ptaxDelta: -0.15,
              reservesDelta: +1.5,
              volatilityDelta: -8.0,
              feedback: 'EXCELENTE: O Tripé Macroeconômico de 1999 tornou-se a espinha dorsal da estabilidade monetária brasileira por mais de duas décadas.',
              scoreDelta: +40
            },
            {
              id: 'c2_capital_controls',
              text: 'Congelar o mercado de câmbio e proibir remessas internacionais de divisas.',
              ptaxDelta: +0.40,
              reservesDelta: -2.0,
              volatilityDelta: +15.0,
              feedback: 'DESASTROSO: O controle arbitrário de capitais destruiria a credibilidade internacional do país e geraria um mercado paralelo descontrolado.',
              scoreDelta: -30
            }
          ]
        }
      ]
    },
    {
      id: 'crisis_2008',
      year: '2008',
      title: '2008: Quebra do Lehman Brothers & O Choque de Liquidez Global',
      subtitle: 'Sudden stop internacional e o teste das novas ferramentas do BCB',
      badge: '🌊 Navegador de Liquidez',
      initialState: {
        ptax: 1.6200,
        reserves: 205.0, // Brasil acumulou reservas e tornou-se credor externo líquido
        volatility: 35.0,
        netFlow: -2400,
        regime: 'Câmbio Flutuante Sujo (Managed Float)'
      },
      story: 'Em setembro de 2008, o banco de investimentos Lehman Brothers vai à falência nos EUA. O crédito interbancário mundial paralisa repentinamente ("sudden stop"). Multinacionais e bancos fecham linhas de comércio exterior para o Brasil, e empresas com derivativos tóxicos (ex: Sadia e Aracruz) sofrem perdas multibilionárias.',
      steps: [
        {
          round: 1,
          eventTitle: 'Paralisia das Linhas de Crédito para Exportadores (ACC/ACE)',
          eventDescription: 'Exportadores brasileiros não conseguem financiamento em dólares para embarcar suas cargas, mesmo com contratos fechados. O dólar dispara de R$ 1,60 para R$ 2,40.',
          choices: [
            {
              id: 'c2008_line_auction',
              text: 'Realizar Leilões de Linha com compromisso de recompra (US$ 4 bi) para irrigar os bancos e exportadores.',
              ptaxDelta: -0.25,
              reservesDelta: -2.0,
              volatilityDelta: -10.0,
              feedback: 'PERFEITO: Os Leilões de Linha com recompra foram a grande inovação do BCB em 2008. Forneceram dólares temporários às empresas sem perda permanente de reservas soberanas.',
              scoreDelta: +45
            },
            {
              id: 'c2008_burn_reserves',
              text: 'Vender maciçamente US$ 30 bilhões de reservas em leilões diretos sem recompra.',
              ptaxDelta: -0.30,
              reservesDelta: -30.0,
              volatilityDelta: -5.0,
              feedback: 'SUB-ÓTIMO: Embora alivie a PTAX, a queima definitiva de US$ 30 bi reduziu o escudo de reservas desnecessariamente, já que a crise era de liquidez temporária e não de insolvência soberana.',
              scoreDelta: +10
            }
          ]
        },
        {
          round: 2,
          eventTitle: 'Demanda Corporativa Desesperada por Proteção Cambial',
          eventDescription: 'Grandes companhias demandam desesperadamente hedge cambial futuro para mitigar rombos de descasamento no balanço.',
          choices: [
            {
              id: 'c2008_swaps',
              text: 'Ofertar Swaps Cambiais Tradicionais em larga escala para suprir a demanda de hedge do setor privado.',
              ptaxDelta: -0.18,
              reservesDelta: 0.0,
              volatilityDelta: -8.0,
              feedback: 'EXCELENTE: O BCB atuou como provedor de liquidez sintética via swaps, absorvendo o pânico cambial sem queimar dólares das reservas internacionais.',
              scoreDelta: +45
            },
            {
              id: 'c2008_do_nothing',
              text: 'Não intervir e deixar o mercado futuro colapsar com empresas quebrando.',
              ptaxDelta: +0.45,
              reservesDelta: 0.0,
              volatilityDelta: +18.0,
              feedback: 'FALHA DE POLÍTICA: Sob regime flutuante sujo, o BCB tem o dever de atuar contra disfunções agudas de mercado. A inação levaria à falência em cadeia de exportadores estratégicos.',
              scoreDelta: -30
            }
          ]
        }
      ]
    },
    {
      id: 'crisis_2020',
      year: '2020',
      title: '2020: Pandemia de COVID-19 & Fuga Global para a Qualidade',
      subtitle: 'Volatilidade extrema e atuação combinada com o colchão de reservas',
      badge: '🛡️ Guardião das Reservas',
      initialState: {
        ptax: 4.0500,
        reserves: 356.0,
        volatility: 42.0,
        netFlow: -3100,
        regime: 'Câmbio Flutuante Sujo (Managed Float)'
      },
      story: 'Março de 2020. O mundo declara pandemia global. Bolsas acionárias mundiais acionam sucessivos Circuit Breakers. Investidores globais liquidam posições em todas as moedas emergentes para comprar títulos do governo americano e dinheiro em caixa (fuga para a qualidade). No Brasil, o dólar supera R$ 5,00 e ruma a R$ 6,00.',
      steps: [
        {
          round: 1,
          eventTitle: 'Disparada Vertiginosa da PTAX e Volatilidade Recorde',
          eventDescription: 'O Real sofre a maior desvalorização entre os pares emergentes. A cotação atinge R$ 5,80 com volatilidade implícita acima de 40%.',
          choices: [
            {
              id: 'c2020_combined',
              text: 'Atuação mista e calibrada: Swaps Cambiais contínuos combinados a intervenções pontuais no mercado à vista.',
              ptaxDelta: -0.22,
              reservesDelta: -4.0,
              volatilityDelta: -12.0,
              feedback: 'MUITO BEM: A combinação estratégica de Swaps (hedge futuro) e vendas diretas comedidas das reservas aliviou a disfunção sem dilapidar o robusto colchão de US$ 350 bi.',
              scoreDelta: +45
            },
            {
              id: 'c2020_fix_rate',
              text: 'Fixar o dólar artificialmente em R$ 4,50 e prometer vender quantos dólares o mercado quiser.',
              ptaxDelta: +0.50,
              reservesDelta: -50.0,
              volatilityDelta: +25.0,
              feedback: 'DESASTRE REGULATÓRIO: Tentar fixar a taxa de câmbio contra o choque global mais severo do século esgotaria centenas de bilhões de reservas em semanas.',
              scoreDelta: -40
            }
          ]
        },
        {
          round: 2,
          eventTitle: 'Normalização Gradual e Preservação do Regime Flutuante',
          eventDescription: 'Após a tempestade inicial, o mercado começa a reabrir gradativamente. A autoridade monetária deve definir a postura de longo prazo.',
          choices: [
            {
              id: 'c2020_float_absorb',
              text: 'Deixar o câmbio flutuar para absorver os novos preços relativos globais, mantendo reservas elevadas como seguro soberano.',
              ptaxDelta: -0.05,
              reservesDelta: +1.0,
              volatilityDelta: -6.0,
              feedback: 'EQUILÍBRIO MACROECONÔMICO: O regime flutuante cumpriu seu papel de amortecedor de choque externo, mantendo as reservas preservadas para garantir a solvência da dívida soberana.',
              scoreDelta: +40
            },
            {
              id: 'c2020_reimpose_bands',
              text: 'Voltar ao regime pré-1999 de bandas cambiais estreitas.',
              ptaxDelta: +0.20,
              reservesDelta: -5.0,
              volatilityDelta: +10.0,
              feedback: 'RETROCESSO: Bandas cambiais estreitas eliminam a flexibilidade de preços e atraem ataques especulativos.',
              scoreDelta: -20
            }
          ]
        }
      ]
    },
    {
      id: 'crisis_fed_hike',
      year: 'Recente',
      title: 'Aperto Monetário do Fed & A Supremacia do Dólar Global',
      subtitle: 'Taxas americanas no maior patamar em 20 anos e o diferencial de juros',
      badge: '📈 Mestre do Carry Trade',
      initialState: {
        ptax: 5.1500,
        reserves: 345.0,
        volatility: 18.0,
        netFlow: -800,
        regime: 'Câmbio Flutuante Sujo (Managed Float)'
      },
      story: 'O banco central americano (Fed) eleva os juros de 0% para acima de 5% a.a. para combater a maior inflação em 40 anos nos EUA. O índice DXY (força do dólar frente às moedas mundiais) atinge níveis históricos. Todos os ativos de países emergentes sofrem pressão de desvalorização.',
      steps: [
        {
          round: 1,
          eventTitle: 'Drenagem de Capital de Risco Global',
          eventDescription: 'Investidores internacionais reduzem a exposição em Bolsa e títulos emergentes para alocar em Treasuries sem risco pagando mais de 5% em dólar.',
          choices: [
            {
              id: 'cfed_selic_differential',
              text: 'Manter a política de câmbio flutuante aliada a diferencial de juros (Selic) atrativo e intervenções apenas em picos de estresse.',
              ptaxDelta: -0.08,
              reservesDelta: 0.0,
              volatilityDelta: -4.0,
              feedback: 'CORRETO: O diferencial de juros entre Brasil e EUA (Carry Trade) remunera os investidores, enquanto o câmbio flutuante ajusta a competitividade externa sem queimar reservas.',
              scoreDelta: +45
            },
            {
              id: 'cfed_panic_burn',
              text: 'Vender US$ 40 bilhões de reservas para tentar impedir qualquer oscilação do dólar.',
              ptaxDelta: -0.10,
              reservesDelta: -40.0,
              volatilityDelta: +2.0,
              feedback: 'INEFICIENTE: Lutar contra uma tendência global de fortalecimento do dólar (DXY em alta global) é como tentar enxugar gelo com as reservas internacionais do país.',
              scoreDelta: -25
            }
          ]
        }
      ]
    }
  ];

  class HistoricalChallengeRunner {
    constructor(challengeId) {
      this.challenge = HISTORICAL_CHALLENGES.find(c => c.id === challengeId) || HISTORICAL_CHALLENGES[0];
      this.currentStepIndex = 0;
      this.score = 50; // Pontuação base
      this.state = Object.assign({}, this.challenge.initialState);
      this.history = [];
      this.isFinished = false;
    }

    getCurrentStep() {
      if (this.isFinished) return null;
      return this.challenge.steps[this.currentStepIndex];
    }

    submitChoice(choiceId) {
      const step = this.getCurrentStep();
      if (!step) return null;

      const choice = step.choices.find(c => c.id === choiceId);
      if (!choice) return null;

      // Aplicar impactos
      this.state.ptax = Number(Math.max(1.0, this.state.ptax + choice.ptaxDelta).toFixed(4));
      this.state.reserves = Number(Math.max(0, this.state.reserves + choice.reservesDelta).toFixed(1));
      this.state.volatility = Number(Math.max(5, this.state.volatility + choice.volatilityDelta).toFixed(1));
      this.score = Math.max(0, Math.min(100, this.score + choice.scoreDelta));

      const stepResult = {
        round: step.round,
        eventTitle: step.eventTitle,
        chosen: choice.text,
        feedback: choice.feedback,
        scoreDelta: choice.scoreDelta,
        currentScore: this.score,
        resultingState: Object.assign({}, this.state)
      };

      this.history.push(stepResult);

      this.currentStepIndex += 1;
      if (this.currentStepIndex >= this.challenge.steps.length) {
        this.isFinished = true;
      }

      return {
        stepResult,
        isFinished: this.isFinished,
        finalReport: this.isFinished ? this.generateFinalReport() : null
      };
    }

    generateFinalReport() {
      let grade = 'D';
      let title = 'Gestão Deficiente';
      if (this.score >= 90) { grade = 'A+'; title = 'Mestre em Política Cambial e Gestão Soberana'; }
      else if (this.score >= 80) { grade = 'A'; title = 'Excelente Condutor Macroeconômico'; }
      else if (this.score >= 70) { grade = 'B'; title = 'Bom Desempenho / Prudente'; }
      else if (this.score >= 55) { grade = 'C'; title = 'Regular / Vulnerabilidade Cambial'; }

      return {
        challengeId: this.challenge.id,
        challengeTitle: this.challenge.title,
        badgeEarned: this.score >= 75 ? this.challenge.badge : null,
        finalScore: this.score,
        grade,
        title,
        finalPtax: this.state.ptax,
        finalReserves: this.state.reserves,
        finalVolatility: this.state.volatility,
        history: this.history
      };
    }
  }

  return {
    HISTORICAL_CHALLENGES,
    HistoricalChallengeRunner
  };
});
