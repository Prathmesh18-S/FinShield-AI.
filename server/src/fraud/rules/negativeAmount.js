/**
 * Rule to detect if the transaction amount is negative.
 */
module.exports = {
  name: 'negativeAmount',
  type: 'sync',
  evaluate: (transaction) => {
    const { amount } = transaction;
    if (typeof amount === 'number' && amount < 0) {
      return { score: 40, anomaly: 'NEGATIVE_AMOUNT' };
    }
    return { score: 0, anomaly: null };
  }
};
