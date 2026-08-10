const name = 'Duplicate Transaction';

async function evaluate(transaction, context) {
  try {
    const { batchTransactions, Transaction } = context;
    const { userId, recipientId, amount, timestamp, _id } = transaction;
    const txTime = new Date(timestamp).getTime();
    
    // Check batch
    const batchDuplicate = batchTransactions.find(t => 
      t.userId === userId && 
      t.recipientId === recipientId && 
      t.amount === amount && 
      t._id !== _id && 
      Math.abs(new Date(t.timestamp).getTime() - txTime) <= 60000
    );
    
    if (batchDuplicate) {
      return { score: 45, anomaly: 'DUPLICATE_TRANSACTION' };
    }
    
    // Check DB
    const sixtySecAgo = new Date(txTime - 60000);
    const sixtySecAfter = new Date(txTime + 60000);
    
    const dbDuplicate = await Transaction.findOne({
      userId,
      recipientId,
      amount,
      _id: { $ne: _id },
      timestamp: { $gte: sixtySecAgo, $lte: sixtySecAfter }
    });
    
    if (dbDuplicate) {
      return { score: 45, anomaly: 'DUPLICATE_TRANSACTION' };
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
