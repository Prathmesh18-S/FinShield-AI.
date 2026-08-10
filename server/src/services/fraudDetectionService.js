const ruleEngine = require('../fraud/ruleEngine');
const { getRiskLevel } = require('../constants/riskLevels');

/**
 * Calculates the overall risk for a single transaction using the rule engine.
 * 
 * @param {Object} transaction - The transaction object to evaluate.
 * @param {Object} context - Optional context for rule evaluation.
 * @returns {Promise<Object>} The enriched risk evaluation results.
 */
const calculateRisk = async (transaction, context = {}) => {
  try {
    // Evaluate the transaction against all fraud rules
    const { ruleScore, anomalies } = await ruleEngine.evaluateTransaction(transaction, context);
    
    // Calculate final risk score (currently only based on ruleScore, future expansion for graph/ml)
    const riskScore = ruleScore; 
    
    // Fetch the corresponding risk level definitions based on the score
    const level = getRiskLevel(riskScore);

    // Return the standardized risk evaluation object
    return {
      riskScore,
      riskLevel: level.label,
      status: level.status,
      action: level.action,
      anomalies,
      ruleScore,
      graphScore: 0,
      mlScore: 0
    };
  } catch (error) {
    console.error('[FraudDetectionService] Error in calculateRisk:', error);
    throw new Error('Failed to calculate transaction risk');
  }
};

/**
 * Evaluates a batch of transactions and enriches them with calculated risk data.
 * 
 * @param {Array<Object>} transactions - Array of transaction objects to evaluate.
 * @param {Object} TransactionModel - Mongoose model for fetching historical transaction context.
 * @returns {Promise<Array<Object>>} The array of transactions enriched with risk assessment data.
 */
const calculateBatchRisk = async (transactions, TransactionModel) => {
  if (!Array.isArray(transactions)) {
    throw new Error('Transactions payload must be an array');
  }

  try {
    // Prepare evaluation context
    const context = { 
      batchTransactions: transactions, 
      Transaction: TransactionModel 
    };
    
    // Evaluate risk for all transactions concurrently
    const enrichedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const riskData = await calculateRisk(transaction, context);
        
        // Handle potential mongoose documents vs raw objects gracefully
        const txData = typeof transaction.toObject === 'function' 
          ? transaction.toObject() 
          : transaction;
          
        return {
          ...txData,
          ...riskData
        };
      })
    );

    return enrichedTransactions;
  } catch (error) {
    console.error('[FraudDetectionService] Error in calculateBatchRisk:', error);
    throw new Error('Failed to calculate batch risk for transactions');
  }
};

module.exports = {
  calculateRisk,
  calculateBatchRisk
};