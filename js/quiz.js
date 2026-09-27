/**
 * SimulaCâmbio — Quiz Pedagógico e Avaliação Formativa
 * 10 Questões de Fixação com Explicações Detalhadas e Gamificação
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimulaCambioQuiz = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const QUIZ_QUESTIONS = [
    {
      id: 1,
      topic: 'Regimes Cambiais',
      question: 'Qual é a característica definidora do regime de "Câmbio Flutuante Sujo" (Managed Float) adotado no Brasil desde 1999?',
      options: [
        'O Banco Central fixa uma taxa-alvo estrita e vende reservas sempre que a cotação se desvia dessa meta.',
        'A taxa de câmbio flutua livremente pelas forças de oferta e demanda, mas o Banco Central intervém pontualmente para conter volatilidade excessiva e disfunções na liquidez.',
        'O governo determina por decreto uma banda estreita de oscilação anual atrelada à inflação do IPCA.',
        'O mercado cambial opera sem qualquer supervisão regulatória, sendo vedada qualquer intervenção da autoridade monetária.'
      ],
      correctIndex: 1,
      explanation: 'No regime de câmbio flutuante sujo, não existe uma taxa-alvo pré-fixada. A cotação se ajusta livremente aos choques de mercado, mas o BCB reserva-se o direito de intervir para evitar movimentos especulativos desordenados ou falta transitória de moeda física.'
    },
    {
      id: 2,
      topic: 'Swaps Cambiais',
      question: 'Quando o Banco Central do Brasil realiza um leilão de Swap Cambial Tradicional, qual é a principal vantagem operacional desse instrumento frente à venda de dólares à vista?',
      options: [
        'Ele eleva imediatamente a taxa de juros Selic sem passar pelo crivo do Copom.',
        'Ele atende à demanda do mercado financeiro por proteção (hedge) contra a alta da moeda sem consumir as reservas internacionais soberanas.',
        'Ele zera automaticamente a dívida externa do Tesouro Nacional.',
        'Ele impede que importadores tenham que pagar tarifas de IOF nas suas transações comerciais.'
      ],
      correctIndex: 1,
      explanation: 'O swap tradicional funciona como uma venda de dólares no mercado futuro: o BCB assume a variação do dólar e recebe a taxa Selic. O mercado obtém proteção financeira ("hedge"), aliviando a pressão sobre a PTAX sem que o país queime um único dólar físico de suas reservas internacionais.'
    },
    {
      id: 3,
      topic: 'Instrumentos de Intervenção',
      question: 'Em que situação de mercado o Banco Central deve priorizar a realização de "Leilões de Linha com compromisso de recompra" em vez de apenas ofertar Swaps Cambiais?',
      options: [
        'Quando a Bolsa de Valores estiver em recorde histórico de valorização.',
        'Quando houver escassez de liquidez de moeda física no mercado à vista para suprir compromissos pontuais de comércio exterior (ex: exportadores e importadores).',
        'Quando o Real estiver se valorizando excessivamente frente ao Dólar.',
        'Quando o governo quiser incentivar viagens de turismo ao exterior.'
      ],
      correctIndex: 1,
      explanation: 'Os leilões de linha fornecem dólares físicos à vista para os bancos com a garantia contratual de que a moeda será recomprada pelo BCB meses depois. É a ferramenta adequada quando falta dinheiro físico para financiar o comércio exterior, ao passo que o swap só fornece proteção financeira no papel.'
    },
    {
      id: 4,
      topic: 'Valor Efetivo Total (VET)',
      question: 'O que representa o VET (Valor Efetivo Total) exigido pela regulamentação do Banco Central para operações de câmbio?',
      options: [
        'A soma simples da taxa de câmbio PTAX divulgada às 13h pelo BCB.',
        'O custo total real por unidade de moeda estrangeira, consolidando a taxa de câmbio contratada, o IOF e todas as tarifas e encargos cobrados pela instituição.',
        'O imposto federal cobrado pela Receita Federal na declaração anual do Imposto de Renda.',
        'A rentabilidade acumulada de aplicações em títulos públicos indexados ao dólar.'
      ],
      correctIndex: 1,
      explanation: 'O VET foi criado justamente para dar transparência ao consumidor e empresas, revelando o custo efetivo por unidade de moeda estrangeira: VET = (Total gasto em R$ com taxa + IOF + tarifas) / (Total em moeda estrangeira). Ele impede que instituições mascarem spreads altos sob o pretexto de "taxa zero".'
    },
    {
      id: 5,
      topic: 'Tributação e IOF',
      question: 'Considerando a regulamentação brasileira de câmbio, qual modalidade geralmente apresenta o menor custo tributário de IOF para envio próprio a uma conta internacional?',
      options: [
        'Cartão de Crédito Internacional (IOF de 3,50% ou 6,38%).',
        'Remessa para conta de mesma titularidade via fintech/conta global ou espécie (IOF de 1,10%).',
        'Financiamento de curto prazo em moeda estrangeira no exterior (IOF de 15%).',
        'Todas as modalidades cobram obrigatoriamente a mesma alíquota única de 10%.'
      ],
      correctIndex: 1,
      explanation: 'A compra de moeda em espécie e a remessa entre contas da mesma titularidade (ex: conta corrente no Brasil para a própria conta global no exterior) recolhem 1,10% de IOF, enquanto o cartão de crédito recolhe taxas mais elevadas de IOF e spreads bancários substancialmente maiores.'
    },
    {
      id: 6,
      topic: 'Gestão Corporativa de Risco',
      question: 'O que caracteriza o fenômeno conhecido como "Efeito Balanço" (descasamento cambial) em uma empresa?',
      options: [
        'Quando uma empresa tem suas receitas em moeda estrangeira e todas as suas despesas em Reais.',
        'Quando a empresa possui dívidas contraídas em moeda estrangeira (passivo em US$) sem receita equivalente em dólar e sem proteção de hedge, sofrendo explosão de despesas financeiras quando o Real desvaloriza.',
        'Quando a empresa decide pagar dividendos extraordinários em dólares aos seus acionistas minoritários.',
        'Quando a empresa investe todo o seu caixa em títulos da dívida pública brasileira atrelados à Selic.'
      ],
      correctIndex: 1,
      explanation: 'O descasamento cambial passivo é fatal: a empresa fatura em Reais, mas sua dívida cresce a cada centavo de alta do dólar. No DRE, isso gera pesadas perdas financeiras não operacionais que corroem o patrimônio líquido e podem provocar falência técnica.'
    },
    {
      id: 7,
      topic: 'Derivativos e Hedge',
      question: 'Por que tesoureiros corporativos de indústrias importadoras utilizam minicontratos futuros de dólar (WDO) na B3 ou NDFs bancários?',
      options: [
        'Para especular no mercado financeiro buscando dobrar os lucros da fábrica.',
        'Para travar a taxa de câmbio futura de insumos importados, garantindo previsibilidade de custos e protegendo a margem operacional planejada.',
        'Para evitar o pagamento do imposto de importação alfandegário.',
        'Porque a legislação brasileira proíbe o pagamento de fornecedores internacionais com câmbio pronto.'
      ],
      correctIndex: 1,
      explanation: 'O objetivo genuíno do hedge corporativo é a proteção, não a especulação. Ao travar a taxa futura, a companhia blinda seu orçamento contra choques imprevistos, sabendo exatamente quanto precisará desembolsar para quitar seus insumos.'
    },
    {
      id: 8,
      topic: 'História Macroeconômica',
      question: 'Qual evento marcou a transição da política econômica brasileira em janeiro de 1999?',
      options: [
        'O abandono do câmbio fixo/bandas cambiais após a queima drástica de reservas soberanas e a instituição do Tripé Macroeconômico.',
        'A criação do Plano Real e a extinção da moeda Cruzeiro Real.',
        'A declaração de moratória unilateral da dívida externa brasileira perante o FMI.',
        'A proibição completa de operações com derivativos na bolsa de valores brasileira.'
      ],
      correctIndex: 0,
      explanation: 'Em janeiro de 1999, o Brasil esgotou a sustentabilidade da âncora cambial após as crises russa e asiática. Foi adotado o regime de câmbio flutuante, consolidando o Tripé Macroeconômico: metas de inflação, metas fiscais e câmbio flutuante.'
    },
    {
      id: 9,
      topic: 'Nova Lei Cambial (14.286/2021)',
      question: 'Qual inovação foi introduzida pela Nova Lei Cambial (Lei nº 14.286/2021) em relação aos exportadores brasileiros?',
      options: [
        'Exportadores são agora obrigados a converter 100% de seus recebíveis em Reais em até 24 horas após o embarque da carga.',
        'Exportadores têm a liberdade de manter integralmente seus recursos em moeda estrangeira no exterior para pagar compromissos comerciais, sem necessidade de internalização compulsória.',
        'Foi extinta a necessidade de emissão de faturas comerciais para o comércio exterior.',
        'O imposto sobre exportação passou a ser cobrado exclusivamente em barras de ouro físico.'
      ],
      correctIndex: 1,
      explanation: 'O novo marco legal conferiu autonomia aos exportadores para manter suas receitas de exportação no exterior, permitindo que paguem fornecedores internacionais sem sofrer a perda de duas conversões cambiais e múltiplos spreads bancários.'
    },
    {
      id: 10,
      topic: 'Mercado Global e DXY',
      question: 'Quando o índice DXY (Dollar Index) tem uma elevação acentuada nos mercados internacionais, o que isso costuma indicar para o mercado de câmbio brasileiro?',
      options: [
        'Que o Real vai se valorizar automaticamente frente a todas as moedas globais.',
        'Que o dólar está se fortalecendo globalmente frente às principais moedas do mundo, gerando pressão de desvalorização e saída de capitais em mercados emergentes como o Brasil.',
        'Que as taxas de juros no Brasil cairão para zero de forma imediata.',
        'Que o saldo da balança comercial brasileira se tornará deficitário no mesmo instante.'
      ],
      correctIndex: 1,
      explanation: 'O DXY mede a força do dólar contra uma cesta de moedas fortes. Sua disparada reflete um movimento global de apreciação do dólar e atração de recursos para ativos americanos seguros, depreciando as moedas de países emergentes.'
    }
  ];

  class QuizEngine {
    constructor() {
      this.questions = QUIZ_QUESTIONS;
      this.currentIndex = 0;
      this.answers = {};
      this.isSubmitted = false;
    }

    getCurrentQuestion() {
      return this.questions[this.currentIndex];
    }

    recordAnswer(questionId, selectedOptionIndex) {
      this.answers[questionId] = selectedOptionIndex;
    }

    next() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex += 1;
      }
    }

    prev() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
      }
    }

    goTo(index) {
      if (index >= 0 && index < this.questions.length) {
        this.currentIndex = index;
      }
    }

    evaluate() {
      this.isSubmitted = true;
      let correctCount = 0;

      const details = this.questions.map(q => {
        const userChoice = this.answers[q.id];
        const isCorrect = (userChoice === q.correctIndex);
        if (isCorrect) correctCount += 1;

        return {
          questionId: q.id,
          topic: q.topic,
          question: q.question,
          options: q.options,
          userChoice,
          correctIndex: q.correctIndex,
          isCorrect,
          explanation: q.explanation
        };
      });

      const percentage = (correctCount / this.questions.length) * 100;
      let badge = null;
      let rankTitle = 'Iniciante em Câmbio';

      if (percentage === 100) {
        badge = '🏆 Especialista Máximo em Política Cambial';
        rankTitle = 'Diretor de Política Cambial Honorário';
      } else if (percentage >= 80) {
        badge = '🎖️ Analista Sênior de Câmbio e Macro';
        rankTitle = 'Operador Sênior de Mesa Cambial';
      } else if (percentage >= 60) {
        badge = '📜 Praticante Certificado de Câmbio';
        rankTitle = 'Analista Pleno de Comércio Exterior';
      }

      return {
        totalQuestions: this.questions.length,
        correctCount,
        percentage: Number(percentage.toFixed(1)),
        badge,
        rankTitle,
        details
      };
    }
  }

  return {
    QUIZ_QUESTIONS,
    QuizEngine
  };
});
