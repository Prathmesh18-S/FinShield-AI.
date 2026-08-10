/**
 * Rule to detect if the transaction amount is exactly zero.
 */
module.exports = {
  name: 'zeroAmount',
  type: 'sync',
  evaluate: (transaction) => {
    const { amount } = transaction;
    if (amount === 0) {
      return { score: 30, anomaly: 'ZERO_AMOUNT' };
    }
    return { score: 0, anomaly: null };
  }
};
