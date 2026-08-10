/**
 * Rule to detect if the transaction amount is unusually high.
 */
module.exports = {
  name: 'highAmount',
  type: 'sync',
  evaluate: (transaction) => {
    const { amount } = transaction;
    if (typeof amount === 'number') {
      if (amount > 100000) {
        return { score: 30, anomaly: 'VERY_HIGH_AMOUNT' };
      } else if (amount > 50000) {
        return { score: 20, anomaly: 'HIGH_AMOUNT' };
      }
    }
    return { score: 0, anomaly: null };
  }
};
