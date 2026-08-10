const name = 'Rapid Recipient Change';

async function evaluate(transaction, context) {
  try {
    const { batchTransactions, Transaction } = context;
    const { userId, recipientId, timestamp, _id } = transaction;
    const txTime = new Date(timestamp).getTime();
    const oneMinAgo = new Date(txTime - 60000);
    const oneMinAfter = new Date(txTime + 60000);
    
    const recipients = new Set([recipientId]);
    
    // Batch
    batchTransactions.forEach(t => {
      if (t.userId === userId && t._id !== _id) {
        const tTime = new Date(t.timestamp).getTime();
        if (tTime >= oneMinAgo.getTime() && tTime <= oneMinAfter.getTime()) {
          recipients.add(t.recipientId);
        }
      }
    });
    
    if (recipients.size >= 3) {
      return { score: 30, anomaly: 'RAPID_RECIPIENT_CHANGE' };
    }
    
    // DB
    const dbRecipients = await Transaction.distinct('recipientId', {
      userId,
      _id: { $ne: _id },
      timestamp: { $gte: oneMinAgo, $lte: oneMinAfter }
    });
    
    dbRecipients.forEach(r => recipients.add(r));
    
    if (recipients.size >= 3) {
      return { score: 30, anomaly: 'RAPID_RECIPIENT_CHANGE' };
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
