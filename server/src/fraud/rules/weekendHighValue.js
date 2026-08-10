/**
 * Rule to detect high-value transactions occurring on weekends.
 */
module.exports = {
  name: 'weekendHighValue',
  type: 'sync',
  evaluate: (transaction) => {
    const { timestamp, amount } = transaction;
    if (timestamp && typeof amount === 'number') {
      const date = new Date(timestamp);
      if (!Number.isNaN(date.getTime())) {
        const day = date.getDay(); // 0 is Sunday, 6 is Saturday
        if ((day === 0 || day === 6) && amount > 50000) {
          return { score: 15, anomaly: 'WEEKEND_HIGH_VALUE' };
        }
      }
    }
    return { score: 0, anomaly: null };
  }
};
