# 💵 SimulaCâmbio — Câmbio e Política Cambial no Brasil

> 🌐 **Acesso Online (GitHub Pages):** [https://ramaandrade.github.io/simulacambio/](https://ramaandrade.github.io/simulacambio/)  
> 📦 **Repositório GitHub:** [https://github.com/ramaandrade/simulacambio](https://github.com/ramaandrade/simulacambio)  
> 🏛️ **Aplicativo Web Educacional (SPA)** voltado para estudantes de graduação em Finanças, Economia, Administração e Ciências Contábeis.  
> ⚖️ Ancorado rigorosamente na legislação brasileira: **Lei Federal nº 14.286/2021 (Novo Marco Legal do Câmbio)**, regulamentações do **Banco Central do Brasil (BCB)** e do **Conselho Monetário Nacional (CMN)**.

---

## 🎯 1. Visão Geral e Objetivos Pedagógicos

O **SimulaCâmbio** traduz a complexidade dos mercados de câmbio e a condução da política cambial brasileira em uma experiência prática, intuitiva e gamificada. 

O estudante atua em dois papéis fundamentais da economia real:
1. **Autoridade Monetária (Banco Central do Brasil - BCB)**:
   - Tomada de decisão sob o regime de **Câmbio Flutuante Sujo** (*Managed Float*), um dos pilares do **Tripé Macroeconômico** brasileiro.
   - Gestão ativa do colchão de **Reservas Internacionais Soberanas** (> US$ 350 bilhões).
   - Execução calibrada dos três instrumentos reais de intervenção do BCB: **Swaps Cambiais** (tradicionais e reversos), **Venda Direta de Reservas à Vista** e **Leilões de Linha com compromisso de recompra**.
2. **Gestor Financeiro Corporativo (CFO) & Pessoa Física**:
   - Gestão de risco cambial em empresa de comércio exterior (*BrasilTech S/A*): decisão entre **Câmbio Pronto** ($T+2$) vs. **Hedge via Contratos Futuros B3 / NDF**, desmistificando o perigo do **Efeito Balanço** (*currency mismatch*).
   - Análise de custos de turismo e remessas através da calculadora oficial do **Valor Efetivo Total (VET)**, desmascarando taxas ocultas e comparando Dólar em Espécie, Cartão Internacional e Contas Globais.

---

## ⚖️ 2. Fundamentos Regulatórios e Modelagem Matemática

### 2.1. O Tripé Macroeconômico e o Regime Flutuante Sujo
Adotado em janeiro de 1999 após o esgotamento das reservas sob a âncora cambial do Plano Real, o Tripé é formado por:
1. **Regime de Metas para a Inflação** (conduzido via Taxa Selic).
2. **Metas de Responsabilidade Fiscal** (equilíbrio das contas públicas).
3. **Câmbio Flutuante**: O câmbio oscila pela interação espontânea entre exportadores, importadores e fluxos de capitais. O BCB intervém apenas para mitigar disfunções de liquidez ou excesso de volatilidade, sem perseguir uma meta fixa de cotação.

### 2.2. Os Três Instrumentos de Intervenção do BCB
* **Swaps Cambiais Tradicionais**:
  O BCB assume a variação cambial da PTAX somada ao cupom cambial e recebe a taxa Selic. Funciona como venda sintética de dólar futuro:
  $$\text{Fluxo BCB} = \text{Selic} - (\Delta PTAX + \text{Cupom Cambial})$$
  *Vantagem Pedagógica*: Atende à demanda privada por proteção cambial (*hedge*) **sem consumir dólares físicos das reservas internacionais**.
* **Venda Direta de Reservas à Vista**:
  Venda de moeda física do estoque de reservas soberanas. Injeta liquidez imediata no sistema interbancário, derrubando a cotação à vista com eficácia, mas reduz o estoque de reservas.
* **Leilões de Linha com Compromisso de Recompra**:
  O BCB vende moeda à vista com contrato irrevogável de recompra em meses futuros ($T+N$). Alivia a falta temporária de crédito comercial para exportadores (ACC/ACE) sem sangrar permanentemente os cofres do país.

### 2.3. A Fórmula Oficial do Valor Efetivo Total (VET)
Regulamentada pela Circular BCB nº 3.691/2013 e pela Lei nº 14.286/2021:
$$VET = \frac{\text{Valor Total em Reais (Taxa Contratada } \times \text{ Moeda Estrangeira) } + \text{IOF} + \text{Tarifas Fixas}}{\text{Total em Moeda Estrangeira Adquirida}}$$

Onde a **Taxa Contratada** é obtida por:
$$\text{Taxa Contratada} = \text{Taxa Base PTAX} \times (1 + \text{Spread Cambial})$$

### 2.4. Gestão Corporativa: O Efeito Balanço (Balance Sheet Currency Mismatch)
Quando uma empresa industrial fatura em Reais (mercado interno) mas contrai obrigações em moeda estrangeira (insumos ou dívida externa não protegida):
$$\text{Resultado FX} = \text{Dívida em US\$} \times (\text{PTAX}_{\text{Final}} - \text{PTAX}_{\text{Inicial}})$$
Se o dólar dispara e a empresa está desprotegida (*unhedged*), essa despesa financeira passiva entra no DRE e corrói o lucro operacional, podendo acarretar falência técnica. O uso de **Hedge (Futuros B3 WDO/DOL)** trava o custo antecipadamente na taxa a termo ($F$).

---

## 🚀 3. Como Executar a Aplicação

### Opção 1: Execução Direta no Navegador (Zero Instalação)
Basta abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox, Safari). O aplicativo foi construído com tecnologias web nativas (HTML5, CSS3, JavaScript ES6+ e Chart.js) e roda 100% no cliente.

### Opção 2: Servidor Local via Node.js
Para rodar como servidor web em salas de aula, computadores de laboratório ou ambientes locais:
```bash
# Iniciar o servidor local na porta 3301
npm start
# ou: node server.js
```
Acesse em: **`http://localhost:3301`**

---

## 🧪 4. Suíte de Testes Automatizados

Para validar o motor econômico e os cálculos matemáticos:
```bash
npm test
# ou: node tests/simulation.test.js
```

Os testes automatizados cobrem:
* Cálculo oficial do VET com alíquotas de IOF (1,10%, 3,50%, etc.) e spreads.
* Prova matemática de que Swaps Cambiais não alteram reservas físicas internacionais.
* Dedutibilidade de reservas na Venda Direta à Vista.
* Payoffs e DRE comparativo de estratégias de Hedge corporativo.
* Validação do motor de decisões e pontuação dos cenários históricos de crise.
* Avaliação formativa do Quiz.

---

## 🕹️ 5. Os Módulos do SimulaCâmbio

1. **🏛️ Mesa de Política Cambial (Banco Central)**:
   - Dashboard com live ticker tape, PTAX, Reservas (US$ bi), Volatilidade anualizada, Cupom Cambial e Fluxo Líquido (Comercial vs Financeiro).
   - Gráficos em tempo real com Chart.js.
   - Terminal de intervenções com controle de volume e botão de choques externos (Fed hike, boom de commodities, crise fiscal).
   - Diário de operações auditável e emissão de comunicados oficiais impressíveis da diretoria de câmbio.

2. **🏢 Mesa Corporativa & Análise de Hedge**:
   - Gestão da empresa BrasilTech S/A: passivo de US$ 500.000 em 90 dias.
   - Simulador dinâmico de DRE comparativo: Sem Proteção (*Unhedged*) vs. Trava Total (Hedge 100%) vs. Hedge Parcial (50%).
   - Alerta diagnóstico visual sobre o **Efeito Balanço**.

3. **💳 Calculadora Comparativa de VET**:
   - Análise lado a lado de 3 modalidades: Dólar em Espécie (1,10% IOF + spread físico), Cartão de Crédito Internacional (IOF + spread bancário de 5%) e Contas Globais/Remessas Digitais (IOF 1,10% + spread enxuto de 1,5%).
   - Indicação automática da alternativa mais econômica e transparência sobre taxas ocultas.

4. **⏳ Crises & Desafios Históricos**:
   - **1999**: O Fim da Âncora Cambial e a Adoção do Tripé Macroeconômico.
   - **2008**: Quebra do Lehman Brothers e Choque de Liquidez Global.
   - **2020**: Pandemia de COVID-19 e Fuga para a Qualidade.
   - **Recente**: Ciclo de Aperto Monetário do Fed e Carry Trade.
   - Sistema de notas (A+, A, B, C, D), parecer técnico e insígnias.

5. **📖 Glossário & Guia da Nova Lei Cambial (14.286/2021)**:
   - Mais de 18 verbetes com definições formais, aplicações acadêmicas e filtro de busca.
   - Guia interativo dos pilares do Novo Marco Legal do Câmbio.

6. **📝 Quiz Pedagógico & Mural de Conquistas**:
   - 10 questões conceituais e práticas com correção instantânea e fundamentação detalhada.
   - Sistema de medalhas desbloqueáveis armazenadas localmente no navegador.

---

## 📚 6. Estrutura do Projeto

```
simulacambio/
├── index.html                   # Interface SPA completa com Live Ticker, 6 Abas e Modais
├── css/
│   └── styles.css               # Design System Institucional (Dark Situation Room & Light Gabinete)
├── js/
│   ├── model.js                 # Modelo econômico: PTAX, VET, Swaps, Reservas, Efeito Balanço
│   ├── bcb.js                   # Mesa do BCB: Choques de mercado e intervenções
│   ├── corporate.js             # Mesa Corporativa: Simulação de Hedge e DRE
│   ├── vet.js                   # Calculadora oficial de VET e comparador
│   ├── challenges.js            # Motor dos 4 cenários históricos reais
│   ├── glossary.js              # Glossário cambial e guia da Lei 14.286/2021
│   ├── quiz.js                  # Questões de fixação e motor de avaliação formativa
│   └── app.js                   # Controlador UI, sincronização com Chart.js e eventos
├── tests/
│   └── simulation.test.js       # Testes unitários com Node.js nativo
├── server.js                    # Servidor estático Node.js para execução local
├── package.json                 # Metadados e scripts npm test e npm start
└── README.md                    # Documentação técnica e guia pedagógico
```

---

## 👨‍🏫 7. Recomendações para Professores Universitários

* **Dinâmica em Sala de Aula**: Divida a turma em grupos de 3 a 4 alunos. Atribua a um grupo o papel de Diretoria de Política Cambial do BCB e a outro o papel de Tesouraria Corporativa da BrasilTech.
* **Estudos de Caso**: Utilize a aba de *Desafios Históricos* para debater como a economia brasileira se tornou menos vulnerável a crises de balanço de pagamentos após o acúmulo de reservas a partir de 2006.
* **Atividades Formativas**: Ao final do semestre, solicite que os estudantes apresentem o relatório do Quiz e o extrato impresso dos Comunicados Oficiais do BCB.
