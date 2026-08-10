/**
 * Rule to detect nighttime transactions (midnight to 5 AM), especially high-value ones.
 */
module.exports = {
  name: 'nightTransaction',
  type: 'sync',
  evaluate: (transaction) => {
    const { timestamp, amount } = transaction;
    if (timestamp && typeof amount === 'number') {
      const date = new Date(timestamp);
      if (!Number.isNaN(date.getTime())) {
        const hour = date.getHours();
        if (hour >= 0 && hour < 5) {
          if (amount > 50000) {
            return { score: 25, anomaly: 'HIGH_VALUE_NIGHT_TRANSACTION' };
          } else {
            return { score: 10, anomaly: 'NIGHT_TRANSACTION' };
          }
        }
      }
    }
    return { score: 0, anomaly: null };
  }
};
