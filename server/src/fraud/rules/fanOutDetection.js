const name = 'Fan Out Detection';

async function evaluate(transaction, context) {
  try {
    const { batchTransactions, Transaction } = context;
    const { userId, recipientId, timestamp, _id } = transaction;
    const txTime = new Date(timestamp).getTime();
    const tenMinAgo = new Date(txTime - 10 * 60000);
    const tenMinAfter = new Date(txTime + 10 * 60000);
    
    const recipients = new Set([recipientId]);
    
    batchTransactions.forEach(t => {
      if (t.userId === userId && t._id !== _id) {
        const tTime = new Date(t.timestamp).getTime();
        if (tTime >= tenMinAgo.getTime() && tTime <= tenMinAfter.getTime()) {
          recipients.add(t.recipientId);
        }
      }
    });
    
    if (recipients.size >= 5) {
      return { score: 35, anomaly: 'FAN_OUT_PATTERN' };
    }
    
    const dbRecipients = await Transaction.distinct('recipientId', {
      userId,
      _id: { $ne: _id },
      timestamp: { $gte: tenMinAgo, $lte: tenMinAfter }
    });
    
    dbRecipients.forEach(r => recipients.add(r));
    
    if (recipients.size >= 5) {
      return { score: 35, anomaly: 'FAN_OUT_PATTERN' };
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
