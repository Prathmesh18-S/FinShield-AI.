const Transaction = require('../models/transactionModel');

const getDashboard = async (req, res) => {
  try {
    // Total transactions
    const totalTransactions = await Transaction.countDocuments();
    
    // Risk distribution (group by riskLevel)
    const riskDistribution = await Transaction.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent flagged transactions (non-Normal)
    const recentAlerts = await Transaction.find({ riskLevel: { $ne: 'Normal' } })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('transactionId userId recipientId amount riskScore riskLevel anomalies timestamp');
    
    // Critical transactions
    const criticalTransactions = await Transaction.find({ riskLevel: 'Critical' })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Top anomalies breakdown
    const topAnomalies = await Transaction.aggregate([
      { $unwind: '$anomalies' },
      { $group: { _id: '$anomalies', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);
    
    // Risk score statistics
    const riskStats = await Transaction.aggregate([
      { $group: {
        _id: null,
        avgScore: { $avg: '$riskScore' },
        maxScore: { $max: '$riskScore' },
        minScore: { $min: '$riskScore' }
      }}
    ]);
    
    // Transactions per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const transactionsPerDay = await Transaction.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgRisk: { $avg: '$riskScore' }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Per-user risk summary (top risky users)
    const riskyUsers = await Transaction.aggregate([
      { $group: {
        _id: '$userId',
        totalTransactions: { $sum: 1 },
        avgRiskScore: { $avg: '$riskScore' },
        maxRiskScore: { $max: '$riskScore' },
        totalAmount: { $sum: '$amount' },
        flaggedCount: { $sum: { $cond: [{ $gt: ['$riskScore', 20] }, 1, 0] } }
      }},
      { $sort: { avgRiskScore: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalTransactions,
        riskDistribution,
        recentAlerts,
        criticalTransactions,
        topAnomalies,
        riskStats: riskStats[0] || { avgScore: 0, maxScore: 0, minScore: 0 },
        transactionsPerDay,
        riskyUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Dashboard fetch failed',
      error: error.message
    });
  }
};

module.exports = { getDashboard };