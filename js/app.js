/**
 * SimulaCâmbio — Controlador Principal da Interface SPA
 * Gerenciamento de Gráficos (Chart.js), Estado Global, Eventos e Navegação
 */

document.addEventListener('DOMContentLoaded', () => {

  // Instâncias dos Módulos
  const bcbManager = new SimulaCambioBCB.BCBDeskManager();
  let challengeRunner = new SimulaCambioChallenges.HistoricalChallengeRunner('crisis_1999');
  let quizEngine = new SimulaCambioQuiz.QuizEngine();

  // Referências aos Gráficos Chart.js
  let ptaxChartInstance = null;
  let reservesChartInstance = null;
  let corporateChartInstance = null;

  // Estado Local
  let activeTab = 'bcb';
  let unlockedBadges = JSON.parse(localStorage.getItem('simulacambio_badges') || '[]');

  // ========================================================================
  // 1. Inicialização de Tema e Navegação
  // ========================================================================
  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  const currentTheme = localStorage.getItem('simulacambio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButtonText(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('simulacambio_theme', newTheme);
    updateThemeButtonText(newTheme);
    updateAllChartsTheme();
  });

  function updateThemeButtonText(theme) {
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' ? '☀️ Modo Claro' : '🌙 Sala de Situação';
    }
  }

  // Navegação em Abas
  const tabButtons = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  function switchTab(tabId) {
    activeTab = tabId;
    tabButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
    tabPanels.forEach(p => p.classList.toggle('active', p.id === `tab-${tabId}`));

    // Redesenhar gráficos ao abrir abas que possuem canvas
    if (tabId === 'bcb') {
      setTimeout(() => {
        if (ptaxChartInstance) ptaxChartInstance.resize();
        if (reservesChartInstance) reservesChartInstance.resize();
      }, 50);
    } else if (tabId === 'corporate') {
      setTimeout(() => {
        updateCorporateView();
      }, 50);
    } else if (tabId === 'vet') {
      updateVETView();
    }
  }

  // ========================================================================
  // 2. Gráficos Interativos (Chart.js)
  // ========================================================================
  function initCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#9ca3af' : '#475569';

    // Gráfico 1: PTAX Histórica
    const ctxPtax = document.getElementById('chart-ptax');
    if (ctxPtax && typeof Chart !== 'undefined') {
      ptaxChartInstance = new Chart(ctxPtax, {
        type: 'line',
        data: {
          labels: ['T1'],
          datasets: [
            {
              label: 'Dólar PTAX (R$/US$)',
              data: [bcbManager.simulator.ptax],
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              borderWidth: 2.5,
              tension: 0.25,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: textColor, font: { family: 'Inter', size: 11 } } },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: ctx => `PTAX: R$ ${ctx.parsed.y.toFixed(4)}`
              }
            }
          },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                callback: v => `R$ ${Number(v).toFixed(2)}`
              }
            }
          }
        }
      });
    }

    // Gráfico 2: Reservas Internacionais e Swaps
    const ctxReserves = document.getElementById('chart-reserves');
    if (ctxReserves && typeof Chart !== 'undefined') {
      reservesChartInstance = new Chart(ctxReserves, {
        type: 'bar',
        data: {
          labels: ['T1'],
          datasets: [
            {
              label: 'Reservas Internacionais (US$ Bi)',
              data: [bcbManager.simulator.reserves],
              backgroundColor: '#10b981',
              borderRadius: 4
            },
            {
              label: 'Posição em Swaps (US$ Bi)',
              data: [bcbManager.simulator.swapPosition],
              backgroundColor: '#f59e0b',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: textColor, font: { family: 'Inter', size: 11 } } }
          },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                callback: v => `US$ ${v} bi`
              }
            }
          }
        }
      });
    }
  }

  function updateAllChartsTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#9ca3af' : '#475569';

    [ptaxChartInstance, reservesChartInstance, corporateChartInstance].forEach(chart => {
      if (!chart) return;
      if (chart.options.scales.x) {
        chart.options.scales.x.grid.color = gridColor;
        chart.options.scales.x.ticks.color = textColor;
      }
      if (chart.options.scales.y) {
        chart.options.scales.y.grid.color = gridColor;
        chart.options.scales.y.ticks.color = textColor;
      }
      if (chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = textColor;
      }
      chart.update();
    });
  }

  function updateChartsData() {
    const history = bcbManager.simulator.history;
    const labels = history.map(h => `T${h.turn}`);
    const ptaxData = history.map(h => h.ptax);
    const reservesData = history.map(h => h.reserves);
    const swapData = history.map(h => h.swapPosition);

    if (ptaxChartInstance) {
      ptaxChartInstance.data.labels = labels;
      ptaxChartInstance.data.datasets[0].data = ptaxData;
      ptaxChartInstance.update();
    }

    if (reservesChartInstance) {
      reservesChartInstance.data.labels = labels;
      reservesChartInstance.data.datasets[0].data = reservesData;
      reservesChartInstance.data.datasets[1].data = swapData;
      reservesChartInstance.update();
    }
  }

  // ========================================================================
  // 3. Mesa do Banco Central (BCB)
  // ========================================================================
  function updateBCBView() {
    const state = bcbManager.getState();

    // Atualizar Ticker Tape
    const ttPtax = document.getElementById('tt-ptax');
    const ttReserves = document.getElementById('tt-reserves');
    const ttCupom = document.getElementById('tt-cupom');
    const ttSelic = document.getElementById('tt-selic');
    const ttDxy = document.getElementById('tt-dxy');
    const ttFlow = document.getElementById('tt-flow');

    if (ttPtax) ttPtax.innerText = `R$ ${state.ptax.toFixed(4)}`;
    if (ttReserves) ttReserves.innerText = `US$ ${state.reserves.toFixed(1)} bi`;
    if (ttCupom) ttCupom.innerText = `${state.cupomCambial.toFixed(2)}% a.a.`;
    if (ttSelic) ttSelic.innerText = `${state.selic.toFixed(2)}% a.a.`;
    if (ttDxy) ttDxy.innerText = `${state.dxy.toFixed(1)}`;
    if (ttFlow) {
      const sign = state.netFlow >= 0 ? '+' : '';
      ttFlow.innerText = `${sign}US$ ${state.netFlow.toFixed(0)} mi`;
    }

    // Atualizar Stat Cards
    const elPtax = document.getElementById('bcb-ptax-val');
    const elReserves = document.getElementById('bcb-reserves-val');
    const elVol = document.getElementById('bcb-vol-val');
    const elCupom = document.getElementById('bcb-cupom-val');
    const elFlow = document.getElementById('bcb-flow-val');
    const elSwaps = document.getElementById('bcb-swaps-val');
    const elLines = document.getElementById('bcb-lines-val');

    if (elPtax) elPtax.innerText = `R$ ${state.ptax.toFixed(4)}`;
    if (elReserves) {
      elReserves.innerText = `US$ ${state.reserves.toFixed(1)} bi`;
      const diff = state.reserves - state.initialReserves;
      const sub = document.getElementById('bcb-reserves-sub');
      if (sub) {
        sub.innerText = diff === 0 ? 'Estável' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)} bi desde o início`;
        sub.style.color = diff < -20 ? 'var(--color-danger)' : 'var(--text-secondary)';
      }
    }
    if (elVol) elVol.innerText = `${state.volatility.toFixed(1)}% a.a.`;
    if (elCupom) elCupom.innerText = `${state.cupomCambial.toFixed(2)}% a.a.`;
    if (elFlow) {
      const sign = state.netFlow >= 0 ? '+' : '';
      elFlow.innerText = `${sign}US$ ${state.netFlow.toFixed(0)} mi`;
      elFlow.style.color = state.netFlow < 0 ? 'var(--color-danger)' : 'var(--color-success)';
    }
    if (elSwaps) elSwaps.innerText = `US$ ${state.swapPosition.toFixed(1)} bi`;
    if (elLines) elLines.innerText = `US$ ${state.lineAuctions.toFixed(1)} bi`;

    // Atualizar Banner de Cenário de Mercado Pendente
    const banner = document.getElementById('scenario-alert-banner');
    if (banner) {
      if (state.pendingScenario) {
        banner.style.display = 'flex';
        document.getElementById('scenario-title').innerText = `🚨 ALERTA DE MERCADO: ${state.pendingScenario.name}`;
        document.getElementById('scenario-desc').innerText = state.pendingScenario.description;
        document.getElementById('scenario-hint').innerText = `💡 Orientação Pedagógica: ${state.pendingScenario.hint}`;
      } else {
        banner.style.display = 'none';
      }
    }

    // Atualizar Tabela de Diário de Operações
    renderBCBHistoryTable(state.history);

    // Atualizar Gráficos
    updateChartsData();

    // Checar Conquistas
    checkAchievements(state);
  }

  function renderBCBHistoryTable(history) {
    const tbody = document.getElementById('bcb-history-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    // Mostrar ordens em ordem decrescente de turno
    const sorted = [...history].reverse();

    sorted.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="num-cell">T${row.turn}</td>
        <td><strong>${row.intervention}</strong></td>
        <td class="num-cell">R$ ${row.ptax.toFixed(4)}</td>
        <td class="num-cell">US$ ${row.reserves.toFixed(1)} bi</td>
        <td class="num-cell">${row.volatility.toFixed(1)}%</td>
        <td style="font-size:0.75rem; color:var(--text-secondary); max-width:320px;">${row.rationale}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Intervenções da Mesa BCB
  const interventionButtons = document.querySelectorAll('[data-intervention]');
  interventionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-intervention');
      const volumeInput = document.getElementById('bcb-volume-input');
      const volume = volumeInput ? parseFloat(volumeInput.value) || 1.0 : 1.0;

      try {
        const result = bcbManager.executeTurn(type, volume);
        updateBCBView();
        showToast(`Operação concluída: ${result.record.intervention}`);
      } catch (err) {
        alert(err.message);
      }
    });
  });

  // Botão Injetar Choque de Mercado
  const btnTriggerShock = document.getElementById('btn-trigger-shock');
  if (btnTriggerShock) {
    btnTriggerShock.addEventListener('click', () => {
      const shock = bcbManager.getRandomScenario();
      bcbManager.triggerScenario(shock.id);
      updateBCBView();
      showToast(`Choque de mercado detectado: ${shock.name}`, 'warning');
    });
  }

  // Resetar Simulação
  const btnResetSim = document.getElementById('btn-reset-sim');
  if (btnResetSim) {
    btnResetSim.addEventListener('click', () => {
      if (confirm('Deseja reiniciar a Mesa de Política Cambial para os parâmetros iniciais?')) {
        bcbManager.reset();
        updateBCBView();
        showToast('Simulação reiniciada com sucesso.');
      }
    });
  }

  // ========================================================================
  // 4. Mesa Corporativa & Efeito Balanço
  // ========================================================================
  let corporateState = {
    orderForexUSD: 500000,
    daysToMaturity: 90,
    spotInitialPtax: 5.2000,
    forwardPtax: 5.2750,
    expectedFinalPtax: 5.8500,
    domesticRevenueBRL: 4200000,
    localCostsBRL: 950000,
    strategy: 'unhedged'
  };

  const corporateInputs = [
    'corp-usd-amount',
    'corp-spot-initial',
    'corp-forward-rate',
    'corp-expected-final',
    'corp-revenue-brl',
    'corp-costs-brl'
  ];

  corporateInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        syncCorporateInputsFromDOM();
        updateCorporateView();
      });
    }
  });

  // Seletores de Estratégia
  const strategyCards = document.querySelectorAll('.strategy-card');
  strategyCards.forEach(card => {
    card.addEventListener('click', () => {
      strategyCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      corporateState.strategy = card.getAttribute('data-strategy');
      updateCorporateView();
    });
  });

  function syncCorporateInputsFromDOM() {
    const getVal = (id, fallback) => {
      const el = document.getElementById(id);
      return el ? parseFloat(el.value) || fallback : fallback;
    };

    corporateState.orderForexUSD = getVal('corp-usd-amount', 500000);
    corporateState.spotInitialPtax = getVal('corp-spot-initial', 5.2000);
    corporateState.forwardPtax = getVal('corp-forward-rate', 5.2750);
    corporateState.expectedFinalPtax = getVal('corp-expected-final', 5.8500);
    corporateState.domesticRevenueBRL = getVal('corp-revenue-brl', 4200000);
    corporateState.localCostsBRL = getVal('corp-costs-brl', 950000);
  }

  function updateCorporateView() {
    const perf = SimulaCambioCorporate.simulateCorporatePerformance(corporateState);

    // Atualizar diagnóstico do Efeito Balanço
    const diagBox = document.getElementById('corp-balance-sheet-diagnostic');
    if (diagBox) {
      diagBox.innerHTML = `
        <div style="font-weight:700; margin-bottom:0.3rem;">⚖️ Análise de Risco de Descasamento Cambial:</div>
        <p>${perf.balanceSheetAnalysis}</p>
      `;
      diagBox.style.borderColor = perf.current.hasLoss ? 'var(--color-danger)' : (corporateState.strategy === 'unhedged' ? 'var(--color-warning)' : 'var(--color-success)');
    }

    // Atualizar Tabela DRE
    const setCell = (id, val, isCurrency = true) => {
      const el = document.getElementById(id);
      if (el) {
        el.innerText = isCurrency ? `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : val;
      }
    };

    setCell('dre-unhedged-rev', perf.comparative.unhedged.grossRevenueBRL);
    setCell('dre-unhedged-fx-cost', perf.comparative.unhedged.effectiveFXCostBRL);
    setCell('dre-unhedged-local-cost', perf.comparative.unhedged.otherCostsBRL);
    setCell('dre-unhedged-net-profit', perf.comparative.unhedged.netProfitBRL);
    setCell('dre-unhedged-margin', `${perf.comparative.unhedged.profitMarginPercent}%`, false);

    setCell('dre-hedge100-rev', perf.comparative.hedge_100.grossRevenueBRL);
    setCell('dre-hedge100-fx-cost', perf.comparative.hedge_100.effectiveFXCostBRL);
    setCell('dre-hedge100-local-cost', perf.comparative.hedge_100.otherCostsBRL);
    setCell('dre-hedge100-net-profit', perf.comparative.hedge_100.netProfitBRL);
    setCell('dre-hedge100-margin', `${perf.comparative.hedge_100.profitMarginPercent}%`, false);

    setCell('dre-hedge50-rev', perf.comparative.hedge_50.grossRevenueBRL);
    setCell('dre-hedge50-fx-cost', perf.comparative.hedge_50.effectiveFXCostBRL);
    setCell('dre-hedge50-local-cost', perf.comparative.hedge_50.otherCostsBRL);
    setCell('dre-hedge50-net-profit', perf.comparative.hedge_50.netProfitBRL);
    setCell('dre-hedge50-margin', `${perf.comparative.hedge_50.profitMarginPercent}%`, false);

    // Destacar linha com prejuízo
    const unhedgedRow = document.getElementById('dre-unhedged-net-profit');
    if (unhedgedRow) {
      unhedgedRow.style.color = perf.comparative.unhedged.netProfitBRL < 0 ? 'var(--color-danger)' : 'var(--text-primary)';
    }

    // Gráfico do DRE Comparativo
    updateCorporateChart(perf);
  }

  function updateCorporateChart(perf) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#9ca3af' : '#475569';

    const ctx = document.getElementById('chart-corporate-dre');
    if (!ctx || typeof Chart === 'undefined') return;

    const dataValues = [
      perf.comparative.unhedged.netProfitBRL,
      perf.comparative.hedge_50.netProfitBRL,
      perf.comparative.hedge_100.netProfitBRL
    ];

    const backgroundColors = dataValues.map(v => v < 0 ? '#ef4444' : (v > 400000 ? '#10b981' : '#f59e0b'));

    if (corporateChartInstance) {
      corporateChartInstance.data.datasets[0].data = dataValues;
      corporateChartInstance.data.datasets[0].backgroundColor = backgroundColors;
      corporateChartInstance.update();
    } else {
      corporateChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Sem Proteção (Unhedged)', 'Hedge Parcial (50%)', 'Trava Total (Hedge 100%)'],
          datasets: [{
            label: 'Lucro Líquido Final (R$)',
            data: dataValues,
            backgroundColor: backgroundColors,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                callback: v => `R$ ${(v / 1000).toFixed(0)}k`
              }
            }
          }
        }
      });
    }
  }

  // ========================================================================
  // 5. Calculadora & Comparador de VET
  // ========================================================================
  const vetAmountInput = document.getElementById('vet-amount-forex');
  const vetBaseRateInput = document.getElementById('vet-base-rate');

  if (vetAmountInput) vetAmountInput.addEventListener('input', updateVETView);
  if (vetBaseRateInput) vetBaseRateInput.addEventListener('input', updateVETView);

  function updateVETView() {
    const amount = vetAmountInput ? parseFloat(vetAmountInput.value) || 1000 : 1000;
    const basePtax = vetBaseRateInput ? parseFloat(vetBaseRateInput.value) || bcbManager.simulator.ptax : bcbManager.simulator.ptax;

    const comp = SimulaCambioVET.runModalityComparison(amount, basePtax);

    // Atualizar Banner de Economia
    const savingsBanner = document.getElementById('vet-savings-banner');
    if (savingsBanner) {
      savingsBanner.innerHTML = `
        <div style="font-size:1.1rem; font-weight:800; color:var(--color-success); margin-bottom:0.2rem;">
          Economia Máxima Identificada: R$ ${comp.maxSavingsBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (+${comp.maxSavingsPercent}%)
        </div>
        <div style="font-size:0.82rem; color:var(--text-secondary);">
          Optar por <strong>${comp.bestOption.name}</strong> em vez de <strong>${comp.worstOption.name}</strong> elimina custos ocultos de spread físico e reduz o IOF da operação.
        </div>
      `;
    }

    // Renderizar Cards de Comparativo
    const container = document.getElementById('vet-cards-container');
    if (container) {
      container.innerHTML = '';

      comp.modalities.forEach(item => {
        const card = document.createElement('div');
        card.className = `vet-card ${item.isBest ? 'best' : ''}`;
        card.innerHTML = `
          ${item.isBest ? '<div class="vet-ribbon">⭐ Opção Mais Econômica</div>' : ''}
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <div>
              <h4 style="font-size:0.95rem; font-weight:700;">${item.name}</h4>
              <p style="font-size:0.74rem; color:var(--text-secondary);">${item.channel}</p>
            </div>
            <span class="badge-tag">${item.tag}</span>
          </div>

          <div style="font-size:1.45rem; font-family:var(--font-mono); font-weight:800; color:var(--color-info); margin-bottom:0.2rem;">
            VET: R$ ${item.vetData.vet.toFixed(4)}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.75rem;">
            Custo efetivo por US$ 1,00 adquirido
          </div>

          <ul class="vet-breakdown-list">
            <li class="vet-breakdown-item">
              <span>Taxa Base (PTAX):</span>
              <span class="num-cell">R$ ${item.vetData.baseRate.toFixed(4)}</span>
            </li>
            <li class="vet-breakdown-item">
              <span>Spread Cambial (${item.vetData.spreadPercent}%):</span>
              <span class="num-cell">+R$ ${(item.vetData.contractedRate - item.vetData.baseRate).toFixed(4)}</span>
            </li>
            <li class="vet-breakdown-item">
              <span>Taxa Contratada:</span>
              <span class="num-cell">R$ ${item.vetData.contractedRate.toFixed(4)}</span>
            </li>
            <li class="vet-breakdown-item">
              <span>Alíquota IOF (${item.vetData.iofRatePercent}%):</span>
              <span class="num-cell">R$ ${item.vetData.iofAmount.toFixed(2)}</span>
            </li>
            ${item.vetData.fixedFee > 0 ? `
              <li class="vet-breakdown-item">
                <span>Tarifa Fixa / Balcão:</span>
                <span class="num-cell">R$ ${item.vetData.fixedFee.toFixed(2)}</span>
              </li>
            ` : ''}
            <li class="vet-breakdown-item highlight">
              <span>Total a Pagar (R$):</span>
              <span class="num-cell" style="font-size:1rem; color:var(--color-brand);">R$ ${item.vetData.totalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </li>
          </ul>

          <div style="font-size:0.73rem; background:var(--bg-tertiary); padding:0.6rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-top:auto;">
            <div style="color:var(--color-success); margin-bottom:0.2rem;">✔ <strong>Prós:</strong> ${item.pros}</div>
            <div style="color:var(--text-muted);">✖ <strong>Atenção:</strong> ${item.cons}</div>
          </div>
        `;
        container.appendChild(card);
      });
    }
  }

  // ========================================================================
  // 6. Desafios Históricos e Crises
  // ========================================================================
  const challengeCards = document.querySelectorAll('.challenge-card');
  challengeCards.forEach(card => {
    card.addEventListener('click', () => {
      challengeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const challengeId = card.getAttribute('data-challenge');
      loadHistoricalChallenge(challengeId);
    });
  });

  function loadHistoricalChallenge(challengeId) {
    challengeRunner = new SimulaCambioChallenges.HistoricalChallengeRunner(challengeId);
    renderChallengeUI();
  }

  function renderChallengeUI() {
    const stage = document.getElementById('challenge-stage');
    if (!stage) return;

    const ch = challengeRunner.challenge;
    const step = challengeRunner.getCurrentStep();

    if (challengeRunner.isFinished) {
      const report = challengeRunner.generateFinalReport();
      stage.innerHTML = `
        <div style="text-align:center; padding:1.5rem 0;">
          <div style="font-size:3rem; margin-bottom:0.5rem;">${report.badgeEarned ? '🏆' : '📋'}</div>
          <h3 style="font-size:1.35rem; font-weight:800; margin-bottom:0.25rem;">Desafio Concluído: ${report.challengeTitle}</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1.25rem;">Avaliação Oficial de Desempenho e Estabilidade Macroeconômica</p>

          <div style="display:inline-flex; align-items:center; gap:1.5rem; background:var(--bg-tertiary); border:1px solid var(--border-color); padding:1rem 2rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
            <div>
              <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Pontuação Final</div>
              <div style="font-size:2rem; font-family:var(--font-mono); font-weight:800; color:var(--color-brand);">${report.finalScore} / 100</div>
            </div>
            <div>
              <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Conceito Acadêmico</div>
              <div style="font-size:2rem; font-family:var(--font-mono); font-weight:800; color:${report.finalScore >= 75 ? 'var(--color-success)' : 'var(--color-warning)'};">${report.grade}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Título Conquistado</div>
              <div style="font-size:1rem; font-weight:700; color:var(--text-primary);">${report.title}</div>
            </div>
          </div>

          ${report.badgeEarned ? `
            <div style="margin-bottom:1.5rem;">
              <span class="badge-item unlocked" style="display:inline-flex; font-size:0.95rem; padding:0.5rem 1.25rem;">
                Insígnia Conquistada: ${report.badgeEarned}
              </span>
            </div>
          ` : ''}

          <div style="text-align:left; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.2rem; margin-bottom:1.5rem;">
            <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:0.75rem;">Histórico das Decisões Tomadas:</h4>
            ${report.history.map(h => `
              <div style="margin-bottom:0.75rem; border-left:3px solid var(--color-brand); padding-left:0.75rem;">
                <div style="font-weight:700; font-size:0.82rem;">Rodada ${h.round}: ${h.eventTitle}</div>
                <div style="font-size:0.78rem; color:var(--text-secondary); margin:0.15rem 0;">Decisão: <em>"${h.chosen}"</em></div>
                <div style="font-size:0.76rem; color:var(--color-info);">${h.feedback}</div>
              </div>
            `).join('')}
          </div>

          <button class="btn btn-primary" id="btn-restart-challenge">🔄 Jogar Novamente Este Desafio</button>
        </div>
      `;

      if (report.badgeEarned) {
        unlockBadge(report.badgeEarned);
      }

      document.getElementById('btn-restart-challenge').addEventListener('click', () => {
        loadHistoricalChallenge(ch.id);
      });

      return;
    }

    // Renderizar Etapa Ativa
    stage.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <span class="badge-tag">${ch.year}</span>
          <h3 style="font-size:1.15rem; font-weight:800; display:inline; margin-left:0.5rem;">${ch.title}</h3>
        </div>
        <div style="font-size:0.85rem; font-family:var(--font-mono); font-weight:700; color:var(--color-brand);">
          Etapa ${step.round} de ${ch.steps.length} | Score: ${challengeRunner.score}/100
        </div>
      </div>

      <div style="background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-bottom:1.25rem;">
        <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.25rem;">Contexto Histórico</div>
        <p style="font-size:0.84rem; color:var(--text-primary);">${ch.story}</p>
      </div>

      <div style="border-left:4px solid var(--color-danger); padding-left:1rem; margin-bottom:1.25rem;">
        <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.25rem;">🚨 ${step.eventTitle}</h4>
        <p style="font-size:0.82rem; color:var(--text-secondary);">${step.eventDescription}</p>
      </div>

      <div style="font-size:0.82rem; font-weight:700; margin-bottom:0.5rem;">Qual intervenção você, como autoridade monetária, ordena?</div>
      
      <div class="choices-container">
        ${step.choices.map(c => `
          <div class="choice-box" data-choice="${c.id}">
            <div style="font-weight:700; font-size:0.88rem; margin-bottom:0.25rem;">${c.text}</div>
            <div style="font-size:0.74rem; color:var(--text-muted);">
              Impacto esperado: PTAX (${c.ptaxDelta >= 0 ? '+' : ''}${c.ptaxDelta.toFixed(2)}) | Reservas (${c.reservesDelta >= 0 ? '+' : ''}${c.reservesDelta.toFixed(1)} bi)
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Eventos de clique nas opções
    stage.querySelectorAll('.choice-box').forEach(box => {
      box.addEventListener('click', () => {
        const choiceId = box.getAttribute('data-choice');
        const res = challengeRunner.submitChoice(choiceId);
        showToast(res.stepResult.feedback, res.stepResult.scoreDelta >= 0 ? 'success' : 'danger');
        renderChallengeUI();
      });
    });
  }

  // ========================================================================
  // 7. Glossário e Guia da Nova Lei Cambial (14.286/2021)
  // ========================================================================
  const glossarySearchInput = document.getElementById('glossary-search-input');
  const glossaryCategorySelect = document.getElementById('glossary-category-select');

  if (glossarySearchInput) glossarySearchInput.addEventListener('input', renderGlossary);
  if (glossaryCategorySelect) glossaryCategorySelect.addEventListener('change', renderGlossary);

  function initGlossaryCategories() {
    if (!glossaryCategorySelect) return;
    const cats = SimulaCambioGlossary.getCategories();
    glossaryCategorySelect.innerHTML = cats.map(c => `
      <option value="${c}">${c === 'all' ? 'Todas as Categorias' : c}</option>
    `).join('');
  }

  function renderGlossary() {
    const q = glossarySearchInput ? glossarySearchInput.value : '';
    const cat = glossaryCategorySelect ? glossaryCategorySelect.value : 'all';
    const terms = SimulaCambioGlossary.searchGlossary(q, cat);

    const container = document.getElementById('glossary-cards-container');
    if (!container) return;

    if (terms.length === 0) {
      container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:2rem;">Nenhum verbete encontrado para a busca.</p>`;
      return;
    }

    container.innerHTML = terms.map(item => `
      <div class="glossary-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <h4 style="font-size:0.95rem; font-weight:700; display:flex; align-items:center; gap:0.4rem;">
            <span>${item.icon}</span> ${item.term}
          </h4>
          <span class="badge-tag">${item.category}</span>
        </div>
        <p style="font-size:0.82rem; color:var(--text-primary); margin-bottom:0.5rem;">${item.definition}</p>
        <div style="font-size:0.74rem; color:var(--text-secondary); border-top:1px solid var(--border-subtle); padding-top:0.4rem;">
          <strong>Aplicação Prática:</strong> ${item.academicDetail}
        </div>
      </div>
    `).join('');
  }

  function renderNewLawGuide() {
    const container = document.getElementById('law-pillars-container');
    if (!container) return;

    const guide = SimulaCambioGlossary.NEW_FX_LAW_GUIDE;
    container.innerHTML = `
      <div style="margin-bottom:1.25rem;">
        <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.25rem;">${guide.lawNumber} — ${guide.popularName}</h3>
        <p style="font-size:0.82rem; color:var(--text-secondary);">Vigência a partir de ${guide.effectiveDate}. Uma revolução de simplificação do mercado cambial brasileiro.</p>
      </div>
      ${guide.mainPillars.map(p => `
        <div class="law-pillar-card">
          <h4 style="font-size:0.92rem; font-weight:700; margin-bottom:0.25rem; color:var(--color-info);">${p.title}</h4>
          <p style="font-size:0.82rem; color:var(--text-primary); margin-bottom:0.35rem;">${p.description}</p>
          <div style="font-size:0.75rem; color:var(--color-success); font-weight:600;">
            ✔ Impacto: ${p.benefit}
          </div>
        </div>
      `).join('')}
    `;
  }

  // ========================================================================
  // 8. Quiz Pedagógico e Avaliação
  // ========================================================================
  function renderQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    if (quizEngine.isSubmitted) {
      const evalResult = quizEngine.evaluate();
      container.innerHTML = `
        <div style="text-align:center; padding:1.5rem 0;">
          <div style="font-size:3.5rem; margin-bottom:0.5rem;">${evalResult.percentage >= 70 ? '🎓' : '📚'}</div>
          <h3 style="font-size:1.35rem; font-weight:800; margin-bottom:0.25rem;">Avaliação de Câmbio & Política Cambial</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1.5rem;">Certificado de Conclusão e Relatório de Fixação Conceitual</p>

          <div style="display:inline-flex; align-items:center; gap:2rem; background:var(--bg-tertiary); border:1px solid var(--border-color); padding:1.2rem 2.5rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
            <div>
              <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Acertos</div>
              <div style="font-size:2.2rem; font-family:var(--font-mono); font-weight:800; color:var(--color-brand);">${evalResult.correctCount} / ${evalResult.totalQuestions}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Aproveitamento</div>
              <div style="font-size:2.2rem; font-family:var(--font-mono); font-weight:800; color:${evalResult.percentage >= 70 ? 'var(--color-success)' : 'var(--color-warning)'};">${evalResult.percentage}%</div>
            </div>
            <div>
              <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Patamar Acadêmico</div>
              <div style="font-size:1.05rem; font-weight:700; color:var(--text-primary);">${evalResult.rankTitle}</div>
            </div>
          </div>

          ${evalResult.badge ? `
            <div style="margin-bottom:1.5rem;">
              <span class="badge-item unlocked" style="display:inline-flex; font-size:0.95rem; padding:0.5rem 1.25rem;">
                ${evalResult.badge}
              </span>
            </div>
          ` : ''}

          <div style="text-align:left; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.2rem; margin-bottom:1.5rem;">
            <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:0.75rem;">Gabarito Comentado com Explicação Pedagógica:</h4>
            ${evalResult.details.map((d, idx) => `
              <div style="margin-bottom:1.1rem; border-left:3px solid ${d.isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}; padding-left:0.75rem;">
                <div style="font-weight:700; font-size:0.84rem; margin-bottom:0.2rem;">${idx + 1}. [${d.topic}] ${d.question}</div>
                <div style="font-size:0.78rem; color:${d.isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight:600;">
                  ${d.isCorrect ? '✔ Sua resposta está correta!' : '✖ Resposta incorreta.'}
                </div>
                <div style="font-size:0.76rem; color:var(--text-secondary); margin-top:0.2rem;">
                  <strong>Gabarito:</strong> ${d.options[d.correctIndex]}
                </div>
                <div style="font-size:0.76rem; color:var(--color-info); margin-top:0.2rem;">
                  <strong>Fundamento:</strong> ${d.explanation}
                </div>
              </div>
            `).join('')}
          </div>

          <button class="btn btn-primary" id="btn-restart-quiz">🔄 Refazer o Quiz</button>
        </div>
      `;

      if (evalResult.badge) {
        unlockBadge(evalResult.badge);
      }

      document.getElementById('btn-restart-quiz').addEventListener('click', () => {
        quizEngine = new SimulaCambioQuiz.QuizEngine();
        renderQuiz();
      });

      return;
    }

    const q = quizEngine.getCurrentQuestion();
    const currIdx = quizEngine.currentIndex;
    const total = quizEngine.questions.length;
    const selected = quizEngine.answers[q.id];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <span class="badge-tag">${q.topic}</span>
        <span style="font-size:0.82rem; font-family:var(--font-mono); font-weight:700; color:var(--color-brand);">Questão ${currIdx + 1} de ${total}</span>
      </div>

      <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:1.25rem;">${q.question}</h3>

      <div class="quiz-options-list">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-btn ${selected === i ? 'selected' : ''}" data-opt="${i}">
            <span style="font-family:var(--font-mono); font-weight:700; color:var(--color-brand);">${String.fromCharCode(65 + i)})</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem; border-top:1px solid var(--border-subtle); padding-top:1rem;">
        <button class="btn btn-outline" id="btn-quiz-prev" ${currIdx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>⬅ Anterior</button>
        ${currIdx === total - 1 ? `
          <button class="btn btn-success" id="btn-quiz-finish">Concluir e Ver Resultado 🏁</button>
        ` : `
          <button class="btn btn-primary" id="btn-quiz-next">Próxima ➡</button>
        `}
      </div>
    `;

    // Eventos das opções
    container.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const optIndex = parseInt(btn.getAttribute('data-opt'), 10);
        quizEngine.recordAnswer(q.id, optIndex);
        renderQuiz();
      });
    });

    const btnPrev = document.getElementById('btn-quiz-prev');
    const btnNext = document.getElementById('btn-quiz-next');
    const btnFinish = document.getElementById('btn-quiz-finish');

    if (btnPrev) btnPrev.addEventListener('click', () => { quizEngine.prev(); renderQuiz(); });
    if (btnNext) btnNext.addEventListener('click', () => { quizEngine.next(); renderQuiz(); });
    if (btnFinish) btnFinish.addEventListener('click', () => {
      quizEngine.evaluate();
      renderQuiz();
    });
  }

  // ========================================================================
  // 9. Sistema de Conquistas (Badges)
  // ========================================================================
  function checkAchievements(state) {
    if (state.reserves >= 350 && state.turn >= 5) {
      unlockBadge('🛡️ Guardião das Reservas');
    }
    if (state.swapPosition >= 20.0) {
      unlockBadge('🔄 Provedor de Hedge Sintético');
    }
  }

  function unlockBadge(badgeName) {
    if (!unlockedBadges.includes(badgeName)) {
      unlockedBadges.push(badgeName);
      localStorage.setItem('simulacambio_badges', JSON.stringify(unlockedBadges));
      showToast(`🏆 Conquista Desbloqueada: ${badgeName}!`, 'warning');
      renderBadgesContainer();
    }
  }

  function renderBadgesContainer() {
    const container = document.getElementById('badges-wall');
    if (!container) return;

    const allBadges = [
      '🛡️ Guardião das Reservas',
      '🔄 Provedor de Hedge Sintético',
      '🏛️ Arquiteto do Tripé',
      '🌊 Navegador de Liquidez',
      '📈 Mestre do Carry Trade',
      '🏆 Especialista Máximo em Política Cambial'
    ];

    container.innerHTML = allBadges.map(b => {
      const isUnlocked = unlockedBadges.includes(b);
      return `
        <div class="badge-item ${isUnlocked ? 'unlocked' : ''}" title="${isUnlocked ? 'Conquistado!' : 'Bloqueado'}">
          <span>${isUnlocked ? '⭐' : '🔒'}</span>
          <span>${b}</span>
        </div>
      `;
    }).join('');
  }

  // ========================================================================
  // 10. Modais e Toasts
  // ========================================================================
  const modalAta = document.getElementById('modal-ata');
  const btnOpenAta = document.getElementById('btn-open-ata');
  const btnCloseAta = document.getElementById('btn-close-ata');

  if (btnOpenAta && modalAta) {
    btnOpenAta.addEventListener('click', () => {
      const releases = bcbManager.getState().releases;
      const body = document.getElementById('modal-ata-body');
      if (body) {
        if (releases.length === 0) {
          body.innerHTML = '<p>Nenhuma intervenção registrada até o momento. Execute uma operação para gerar comunicados oficiais.</p>';
        } else {
          body.innerHTML = releases.map(r => `
            <div style="background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-bottom:1rem;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
                <span class="badge-tag">${r.id}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${r.date} — Turno ${r.turn}</span>
              </div>
              <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:0.4rem;">${r.title}</h4>
              <p style="font-size:0.82rem; color:var(--text-primary); margin-bottom:0.4rem;">${r.text}</p>
              <div style="font-size:0.74rem; font-family:var(--font-mono); color:var(--color-info);">
                Cotação PTAX: R$ ${r.ptax.toFixed(4)} | Reservas Soberanas: US$ ${r.reserves.toFixed(1)} bi
              </div>
            </div>
          `).join('');
        }
      }
      modalAta.classList.add('active');
    });
  }

  if (btnCloseAta && modalAta) {
    btnCloseAta.addEventListener('click', () => modalAta.classList.remove('active'));
  }

  function showToast(message, type = 'info') {
    const existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '0.75rem 1.25rem';
    toast.style.borderRadius = 'var(--radius-sm)';
    toast.style.fontSize = '0.82rem';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.animation = 'fadeIn 0.2s ease-in-out';
    toast.style.maxWidth = '380px';

    if (type === 'success') {
      toast.style.background = 'var(--color-success)';
      toast.style.color = '#ffffff';
    } else if (type === 'danger') {
      toast.style.background = 'var(--color-danger)';
      toast.style.color = '#ffffff';
    } else if (type === 'warning') {
      toast.style.background = 'var(--color-warning)';
      toast.style.color = '#ffffff';
    } else {
      toast.style.background = 'var(--color-brand)';
      toast.style.color = '#ffffff';
    }

    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ========================================================================
  // 11. Inicialização Geral
  // ========================================================================
  initCharts();
  updateBCBView();
  initGlossaryCategories();
  renderGlossary();
  renderNewLawGuide();
  renderChallengeUI();
  renderQuiz();
  renderBadgesContainer();

});
