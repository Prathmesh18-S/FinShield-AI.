const invalidAmount = require('./rules/invalidAmount');
const negativeAmount = require('./rules/negativeAmount');
const zeroAmount = require('./rules/zeroAmount');
const highAmount = require('./rules/highAmount');
const futureTimestamp = require('./rules/futureTimestamp');
const nightTransaction = require('./rules/nightTransaction');
const weekendHighValue = require('./rules/weekendHighValue');
const duplicateTransaction = require('./rules/duplicateTransaction');
const highVelocity = require('./rules/highVelocity');
const impossibleTravel = require('./rules/impossibleTravel');
const rapidRecipientChange = require('./rules/rapidRecipientChange');
const dormantAccount = require('./rules/dormantAccount');
const fanOutDetection = require('./rules/fanOutDetection');
const hubDetection = require('./rules/hubDetection');

// Array of all loaded rule modules
const allRules = [
  invalidAmount,
  negativeAmount,
  zeroAmount,
  highAmount,
  futureTimestamp,
  nightTransaction,
  weekendHighValue,
  duplicateTransaction,
  highVelocity,
  impossibleTravel,
  rapidRecipientChange,
  dormantAccount,
  fanOutDetection,
  hubDetection
];

// Separate rules based on their execution type
const syncRules = allRules.filter(rule => rule && rule.type === 'sync');
const asyncRules = allRules.filter(rule => rule && rule.type === 'async');

/**
 * Evaluates a transaction against all synchronous and asynchronous rules.
 * 
 * @param {Object} transaction - The transaction to evaluate
 * @param {Object} context - Context object containing additional data (e.g., batch, DB models)
 * @returns {Promise<Object>} An object containing the capped ruleScore and an array of anomalies
 */
const evaluateTransaction = async (transaction, context = {}) => {
  let totalScore = 0;
  const anomalies = [];

  const processRuleResult = (result) => {
    if (result && result.score) {
      totalScore += result.score;
    }
    if (result && result.anomaly) {
      anomalies.push(result.anomaly);
    }
  };

  // Run all synchronous rules
  syncRules.forEach(rule => {
    try {
      const result = rule.evaluate(transaction, context);
      processRuleResult(result);
    } catch (error) {
      console.error(`[RuleEngine] Error executing sync rule ${rule.name || 'unknown'}:`, error);
    }
  });

  // Run all asynchronous rules
  try {
    const asyncResults = await Promise.all(
      asyncRules.map(rule => 
        rule.evaluate(transaction, context).catch(err => {
          console.error(`[RuleEngine] Error executing async rule ${rule.name || 'unknown'}:`, err);
          return null; // Return null on error to prevent Promise.all from failing entirely
        })
      )
    );

    asyncResults.forEach(processRuleResult);
  } catch (error) {
    console.error('[RuleEngine] Fatal error during async rule execution:', error);
  }

  // Cap the total score at 100
  const ruleScore = Math.min(Math.max(totalScore, 0), 100);

  return {
    ruleScore,
    anomalies
  };
};

/**
 * Evaluates a batch of transactions concurrently.
 * 
 * @param {Array<Object>} transactions - Array of transactions to evaluate
 * @param {Object} TransactionModel - The mongoose Transaction model for database queries
 * @returns {Promise<Array<Object>>} Array of evaluation results
 */
const evaluateBatch = async (transactions, TransactionModel) => {
  if (!Array.isArray(transactions)) {
    throw new Error('Transactions must be an array');
  }
  
  const context = { 
    batchTransactions: transactions, 
    Transaction: TransactionModel 
  };

  try {
    const results = await Promise.all(
      transactions.map(tx => evaluateTransaction(tx, context))
    );
    return results;
  } catch (error) {
    console.error('[RuleEngine] Error during evaluateBatch:', error);
    throw error;
  }
};

module.exports = {
  evaluateTransaction,
  evaluateBatch
};
