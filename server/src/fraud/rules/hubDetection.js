const name = 'Hub Detection';

async function evaluate(transaction, context) {
  try {
    const { batchTransactions, Transaction } = context;
    const { userId, recipientId, timestamp, _id } = transaction;
    const txTime = new Date(timestamp).getTime();
    const tenMinAgo = new Date(txTime - 10 * 60000);
    const tenMinAfter = new Date(txTime + 10 * 60000);
    
    const senders = new Set([userId]);
    
    batchTransactions.forEach(t => {
      if (t.recipientId === recipientId && t._id !== _id) {
        const tTime = new Date(t.timestamp).getTime();
        if (tTime >= tenMinAgo.getTime() && tTime <= tenMinAfter.getTime()) {
          senders.add(t.userId);
        }
      }
    });
    
    if (senders.size >= 5) {
      return { score: 30, anomaly: 'HUB_PATTERN' };
    }
    
    const dbSenders = await Transaction.distinct('userId', {
      recipientId,
      _id: { $ne: _id },
      timestamp: { $gte: tenMinAgo, $lte: tenMinAfter }
    });
    
    dbSenders.forEach(s => senders.add(s));
    
    if (senders.size >= 5) {
      return { score: 30, anomaly: 'HUB_PATTERN' };
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
