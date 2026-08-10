/**
 * Rule to detect if the transaction amount is invalid.
 */
module.exports = {
  name: 'invalidAmount',
  type: 'sync',
  evaluate: (transaction) => {
    const { amount } = transaction;
    if (
      amount === undefined ||
      amount === null ||
      Number.isNaN(amount) ||
      !Number.isFinite(amount)
    ) {
      return { score: 50, anomaly: 'INVALID_AMOUNT' };
    }
    return { score: 0, anomaly: null };
  }
};
