/**
 * Rule to detect if the transaction timestamp is in the future.
 */
module.exports = {
  name: 'futureTimestamp',
  type: 'sync',
  evaluate: (transaction) => {
    const { timestamp } = transaction;
    if (timestamp) {
      const txTime = new Date(timestamp).getTime();
      if (!Number.isNaN(txTime) && txTime > Date.now()) {
        return { score: 40, anomaly: 'FUTURE_TIMESTAMP' };
      }
    }
    return { score: 0, anomaly: null };
  }
};
