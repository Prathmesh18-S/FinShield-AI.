const name = 'Dormant Account';

async function evaluate(transaction, context) {
  try {
    const { Transaction } = context;
    const { userId, timestamp, _id } = transaction;
    const txTime = new Date(timestamp).getTime();
    
    const thirtyDaysAgo = new Date(txTime - 30 * 24 * 60 * 60 * 1000);
    
    // Check if there was any transaction before this one, within the last 30 days
    const recentTx = await Transaction.findOne({
      userId,
      _id: { $ne: _id },
      timestamp: { $gte: thirtyDaysAgo, $lte: new Date(txTime) }
    });
    
    const hasHistory = await Transaction.findOne({
      userId,
      _id: { $ne: _id },
      timestamp: { $lt: thirtyDaysAgo }
    });
    
    if (!recentTx && hasHistory) {
      return { score: 25, anomaly: 'DORMANT_ACCOUNT_ACTIVITY' };
    }
    
    return { score: 0, anomaly: null };
  } catch (error) {
    console.error(`Error in ${name} rule:`, error);
    return { score: 0, anomaly: null };
  }
}

module.exports = {
  name,
  type: 'async',
  evaluate
};
