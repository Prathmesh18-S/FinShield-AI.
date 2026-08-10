const { getRiskLevel } = require('../constants/riskLevels');

// Weights for score components
const WEIGHTS = {
  RULE: 0.5,
  GRAPH: 0.3,
  ML: 0.2
};

/**
 * Aggregates risk scores from Rule Engine, Graph Analytics, and ML Service
 * @param {Object} scores - { ruleScore, graphScore, mlScore }
 * @returns {Object} Final risk assessment
 */
const aggregateRisk = (scores) => {
  const { ruleScore = 0, graphScore = 0, mlScore = 0 } = scores;
  
  // Weighted combination
  let finalScore = Math.round(
    (ruleScore * WEIGHTS.RULE) + 
    (graphScore * WEIGHTS.GRAPH) + 
    (mlScore * WEIGHTS.ML)
  );
  
  // If any individual score is critical (>80), boost final score
  if (ruleScore > 80 || graphScore > 80 || mlScore > 80) {
    finalScore = Math.max(finalScore, 81);
  }
  
  // Clamp to 0-100
  finalScore = Math.min(100, Math.max(0, finalScore));
  
  const level = getRiskLevel(finalScore);
  
  return {
    finalScore,
    riskLevel: level.label,
    status: level.status,
    action: level.action,
    breakdown: {
      ruleScore,
      graphScore,
      mlScore,
      weights: WEIGHTS
    }
  };
};

module.exports = { aggregateRisk, WEIGHTS };
