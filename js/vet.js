/**
 * SimulaCâmbio — Calculadora Oficial e Comparador de VET (Valor Efetivo Total)
 * Análise de Custos Operacionais, Spreads Cambiais, IOF e Tarifas Bancárias
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./model'));
  } else {
    root.SimulaCambioVET = factory(root.SimulaCambioModel);
  }
})(typeof self !== 'undefined' ? self : this, function (Model) {

  const DEFAULT_VET_PARAMS = {
    amountForex: 1000,
    basePtax: 5.2000,
    customSpreadPercent: 2.0,
    customIofRate: 0.011,
    customFixedFee: 20.0
  };

  /**
   * Executa a análise comparativa completa das modalidades de câmbio para turismo e remessa
   */
  function runModalityComparison(amountForex = 1000, basePtax = 5.2000) {
    const comparison = Model.compareFXModalities(amountForex, basePtax);

    // Calcular métricas de economia
    const worstOption = comparison[comparison.length - 1];
    const bestOption = comparison[0];
    const maxSavingsBRL = worstOption.vetData.totalBRL - bestOption.vetData.totalBRL;
    const maxSavingsPercent = ((worstOption.vetData.totalBRL / bestOption.vetData.totalBRL) - 1) * 100;

    return {
      amountForex,
      basePtax,
      bestOption,
      worstOption,
      maxSavingsBRL: Number(maxSavingsBRL.toFixed(2)),
      maxSavingsPercent: Number(maxSavingsPercent.toFixed(2)),
      modalities: comparison
    };
  }

  /**
   * Calcula VET para parâmetros personalizados fornecidos pelo usuário
   */
  function calculateCustomVET(amountForex, basePtax, spreadPct, iofRate, fixedFee) {
    return Model.calculateVET(
      amountForex,
      basePtax,
      spreadPct / 100,
      iofRate,
      fixedFee
    );
  }

  return {
    DEFAULT_VET_PARAMS,
    runModalityComparison,
    calculateCustomVET
  };
});
