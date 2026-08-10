const name = 'High Velocity';

async function evaluate(transaction, context) {
  try {
    const { batchTransactions, Transaction } = context;
    const { userId, timestamp, _id } = transaction;
    const txTime = new Date(timestamp).getTime();
    
    const batchTxCount = batchTransactions.filter(t => 
      t.userId === userId && 
      t._id !== _id && 
      Math.abs(new Date(t.timestamp).getTime() - txTime) <= 2000
    ).length;
    
    if (batchTxCount >= 1) { 
      return { score: 35, anomaly: 'HIGH_VELOCITY' };
    }
    
    const twoSecAgo = new Date(txTime - 2000);
    const twoSecAfter = new Date(txTime + 2000);
    
    const dbTxCount = await Transaction.countDocuments({
      userId,
      _id: { $ne: _id },
      timestamp: { $gte: twoSecAgo, $lte: twoSecAfter }
    });
    
    if (dbTxCount >= 1) {
      return { score: 35, anomaly: 'HIGH_VELOCITY' };
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
