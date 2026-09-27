/**
 * SimulaCâmbio — Base de Conhecimento, Glossário e Guia da Nova Lei Cambial (14.286/2021)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimulaCambioGlossary = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const GLOSSARY_TERMS = [
    {
      term: 'PTAX (Taxa de Câmbio de Referência)',
      category: 'Regulação & BCB',
      definition: 'Média ponderada das taxas de compra e venda de dólares apuradas pelo Banco Central do Brasil em 4 janelas de consulta diárias com as instituições credenciadas (dealers de câmbio).',
      academicDetail: 'A PTAX não é uma taxa imposta pelo BCB, mas sim uma taxa média de referência calculada diariamente. Serve como base de liquidação de contratos derivativos na B3, conversão contábil e contratos internacionais.',
      icon: '📊'
    },
    {
      term: 'Câmbio Flutuante Sujo (Managed Float)',
      category: 'Regulação & BCB',
      definition: 'Regime cambial adotado no Brasil desde 15 de janeiro de 1999, no qual a taxa oscila livremente pela oferta e demanda, mas a autoridade monetária realiza intervenções pontuais para coibir volatilidade desordenada e escassez de liquidez.',
      academicDetail: 'Diferencia-se da flutuação limpa (onde o BCB jamais intervém) e do câmbio fixo. O BCB não defende uma cotação-alvo pré-definida, intervindo apenas para corrigir disfunções de mercado.',
      icon: '🌊'
    },
    {
      term: 'Swaps Cambiais Tradicionais',
      category: 'Instrumentos BCB',
      definition: 'Contratos derivativos de troca de fluxo financeiro onde o Banco Central assume a variação da taxa de câmbio somada ao cupom cambial e recebe a taxa básica de juros (Selic).',
      academicDetail: 'Equivale à venda de dólares no mercado futuro. É uma ferramenta de intervenção sintética que atende à demanda do mercado por hedge cambial sem consumir fisicamente as reservas internacionais do país.',
      icon: '🔄'
    },
    {
      term: 'Swaps Cambiais Reversos',
      category: 'Instrumentos BCB',
      definition: 'Operação inversa ao swap tradicional: o BCB recebe a variação do dólar mais cupom e paga juros (Selic) ao mercado.',
      academicDetail: 'Utilizado quando há excesso de entrada de dólares e o Real passa por valorização rápida e desordenada, funcionando como uma compra de moeda futura.',
      icon: '🔁'
    },
    {
      term: 'Venda Direta de Reservas à Vista',
      category: 'Instrumentos BCB',
      definition: 'Venda de moeda estrangeira física pelo Banco Central debitando diretamente sua conta de reservas internacionais soberanas.',
      academicDetail: 'Tem impacto imediato e poderoso sobre a PTAX à vista por aumentar a oferta de moeda no sistema interbancário, mas reduz permanentemente o estoque de reservas.',
      icon: '💵'
    },
    {
      term: 'Leilões de Linha com Recompra',
      category: 'Instrumentos BCB',
      definition: 'Venda de dólares à vista pelo BCB com compromisso irrevogável de recompra em data futura previamente pactuada.',
      academicDetail: 'Proporciona liquidez temporária para bancos financiarem exportadores e importadores em momentos de estrangulamento de linhas de crédito externas, sem perda permanente de reservas.',
      icon: '🤝'
    },
    {
      term: 'Cupom Cambial (Onshore Dollar Interest)',
      category: 'Mercado Financeiro',
      definition: 'Taxa de juros em dólares praticada no mercado financeiro doméstico brasileiro.',
      academicDetail: 'Reflete o custo de oportunidade do capital em moeda estrangeira no Brasil, derivado da Paridade Coberta de Taxas de Juros (CIP) entre a taxa Selic e o prêmio de risco-país.',
      icon: '📈'
    },
    {
      term: 'Tripé Macroeconômico',
      category: 'Macroeconomia',
      definition: 'Estrutura de política econômica brasileira adotada em 1999, composta por: 1) Regime de Metas para a Inflação; 2) Câmbio Flutuante; 3) Metas de Responsabilidade Fiscal.',
      academicDetail: 'Permite que o câmbio funcione como um amortecedor de choques externos, absorvendo flutuações internacionais sem esgotar o balanço do Estado.',
      icon: '🏛️'
    },
    {
      term: 'VET (Valor Efetivo Total)',
      category: 'Custo & Proteção ao Consumidor',
      definition: 'Indicador obrigatório regulamentado pelo BCB que consolida a taxa de câmbio contratada, o IOF e todas as tarifas e encargos da operação.',
      academicDetail: 'Calculado por: VET = (Valor em R$ total gasto com taxa, IOF e tarifas) / (Total em moeda estrangeira comprada). Permite comparar o custo real entre bancos, fintechs e casas de câmbio.',
      icon: '🏷️'
    },
    {
      term: 'IOF no Câmbio (Decreto 6.306/2007)',
      category: 'Tributação',
      definition: 'Imposto sobre Operações Financeiras incidente sobre a compra e venda de moeda estrangeira e remessas.',
      academicDetail: 'Alíquotas fundamentais: 1,10% para compra de papel-moeda ou transferência para mesma titularidade no exterior; 0,38% para outra titularidade; alíquotas de cartões em trajetória de convergência conforme compromisso com a OCDE.',
      icon: '🧾'
    },
    {
      term: 'Câmbio Pronto (Spot Market)',
      category: 'Mercado Financeiro',
      definition: 'Operação de compra ou venda de moeda estrangeira com entrega e liquidação física e financeira em até dois dias úteis (D+2).',
      academicDetail: 'É a base do mercado à vista de moeda, contrapondo-se aos derivativos e ao câmbio futuro.',
      icon: '⏱️'
    },
    {
      term: 'Hedge Cambial e Contratos Futuros',
      category: 'Gestão Corporativa',
      definition: 'Estratégia financeira de proteção para neutralizar o risco de oscilações cambiais desfavoráveis sobre ativos, passivos ou fluxos futuros de caixa.',
      academicDetail: 'Costuma ser executado via contratos futuros de dólar na B3 (DOL ou WDO), Non-Deliverable Forwards (NDF) ou swaps cambiais bilaterais.',
      icon: '🛡️'
    },
    {
      term: 'Efeito Balanço (Balance Sheet Currency Mismatch)',
      category: 'Gestão Corporativa',
      definition: 'Impacto negativo sobre o patrimônio e a solvência de uma empresa quando ela possui passivos (dívidas) em moeda estrangeira sem receita equivalente em dólar ou sem hedge.',
      academicDetail: 'Quando o Real se desvaloriza, a dívida em Reais dispara na linha de despesas financeiras do DRE, podendo levar companhias lucrativas operacionalmente à falência.',
      icon: '⚖️'
    },
    {
      term: 'Spread Cambial',
      category: 'Mercado Financeiro',
      definition: 'Diferença entre o preço de compra e venda da moeda estrangeira pela instituição autorizada, ou a margem cobrada sobre a taxa de câmbio interbancária.',
      academicDetail: 'Representa a remuneração do banco ou corretora. Casas de câmbio de aeroporto costumam ter spreads físicos elevados, enquanto contas globais digitais oferecem spreads reduzidos.',
      icon: '🔍'
    },
    {
      term: 'DXY (US Dollar Index)',
      category: 'Macroeconomia Global',
      definition: 'Índice internacional que mede a força e o valor do dólar dos EUA em relação a uma cesta de seis moedas fortes (Euro, Iene, Libra, Dólar Canadense, Coroa Sueca e Franco Suíço).',
      academicDetail: 'Quando o DXY sobe fortemente, o dólar está se apreciando contra o mundo todo, gerando pressão de desvalorização sobre quase todas as moedas emergentes em bloco.',
      icon: '🌐'
    },
    {
      term: 'Carry Trade',
      category: 'Mercado Financeiro',
      definition: 'Operação financeira em que investidores tomam empréstimos em moedas com taxas de juros baixas para aplicar em países com taxas de juros elevadas, embolsando o diferencial.',
      academicDetail: 'O Brasil é um destino clássico de Carry Trade quando a taxa Selic oferece um diferencial atrativo em relação aos juros americanos (Fed Funds).',
      icon: '💼'
    },
    {
      term: 'Reservas Internacionais Soberanas',
      category: 'Macroeconomia',
      definition: 'Ativos em moeda forte (US Treasuries, Ouro, Depósitos em Bancos Centrais estrangeiros e Direitos Especiais de Saque) detidos pelo Banco Central.',
      academicDetail: 'O Brasil acumulou mais de US$ 350 bilhões de reservas entre 2006 e 2012, transformando o país em credor externo líquido e criando um seguro indispensável contra ataques especulativos.',
      icon: '🏦'
    },
    {
      term: 'Bandas Cambiais (1995–1998)',
      category: 'História Econômica',
      definition: 'Regime adotado no início do Plano Real em que o BCB definia um teto e um piso rígidos para a cotação do dólar, intervindo obrigatoriamente quando os limites eram testados.',
      academicDetail: 'Foi essencial para consolidar o Plano Real e conter a hiperinflação inercial, mas colapsou em 1999 quando as crises russa e asiática drenaram as reservas nacionais.',
      icon: '📐'
    }
  ];

  const NEW_FX_LAW_GUIDE = {
    lawNumber: 'Lei nº 14.286/2021',
    popularName: 'Novo Marco Legal do Câmbio',
    effectiveDate: '30 de dezembro de 2022',
    mainPillars: [
      {
        title: 'Modernização e Desburocratização Geral',
        description: 'Substituiu e consolidou mais de 40 diplomas legais esparsos e defasados (alguns da década de 1920 e da era Vargas) em uma única lei moderna e alinhada às melhores práticas internacionais da OCDE.',
        benefit: 'Redução de custos operacionais e segurança jurídica para investimentos estrangeiros.'
      },
      {
        title: 'Ampliação do Uso de Contas em Moeda Estrangeira no Brasil',
        description: 'Autoriza gradativamente a abertura de contas em dólares e outras moedas estrangeiras em bancos sediados no Brasil para novos segmentos econômicos regulados pelo BCB.',
        benefit: 'Menor necessidade de remessas artificiais para fora do país e gestão cambial eficiente.'
      },
      {
        title: 'Exportadores com Liberdade de Uso dos Recursos',
        description: 'Exportadores brasileiros podem manter 100% de suas receitas em contas no exterior para pagar fornecedores internacionais, sem a obrigatoriedade de internação compulsória.',
        benefit: 'Eliminação da dupla conversão cambial (bitributação e spreads desnecessários).'
      },
      {
        title: 'Compensação Privada de Créditos Internacionais',
        description: 'Empresas multinacionais ou parceiros comerciais podem compensar créditos e débitos recíprocos decorrentes de operações mercantis diretamente.',
        benefit: 'Facilita a integração das empresas brasileiras nas cadeias globais de suprimentos.'
      },
      {
        title: 'Facilidades para Pessoas Físicas e Viagens',
        description: 'O limite de dinheiro em espécie para viagens ao exterior sem declaração foi atualizado de R$ 10.000 para US$ 10.000 (ou equivalente). Além disso, abriu as portas para fintechs oferecerem contas globais seguras e baratas.',
        benefit: 'Mais liberdade, comodidade e acesso a custos efetivos (VET) substancialmente menores.'
      }
    ]
  };

  function searchGlossary(query = '', category = 'all') {
    const q = query.toLowerCase().trim();
    return GLOSSARY_TERMS.filter(item => {
      const matchesCategory = (category === 'all' || item.category === category);
      const matchesQuery = !q ||
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.academicDetail.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }

  function getCategories() {
    const set = new Set(GLOSSARY_TERMS.map(t => t.category));
    return ['all', ...Array.from(set)];
  }

  return {
    GLOSSARY_TERMS,
    NEW_FX_LAW_GUIDE,
    searchGlossary,
    getCategories
  };
});
