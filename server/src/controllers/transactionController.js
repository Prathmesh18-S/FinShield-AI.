const Transaction = require('../models/transactionModel');

/**
 * Get paginated list of transactions with optional filtering
 */
const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    // Filters
    if (req.query.riskLevel) {
      query.riskLevel = req.query.riskLevel;
    }
    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    if (req.query.startDate || req.query.endDate) {
      query.timestamp = {};
      if (req.query.startDate) query.timestamp.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.timestamp.$lte = new Date(req.query.endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

/**
 * Get a single transaction by ID
 */
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};

/**
 * Get aggregated statistics for transactions
 */
const getTransactionStats = async (req, res) => {
  try {
    const totalCount = await Transaction.countDocuments();

    const amountsByRiskLevel = await Transaction.aggregate([
      { $group: { _id: '$riskLevel', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } }
    ]);

    const commonAnomalies = await Transaction.aggregate([
      { $unwind: '$anomalies' },
      { $group: { _id: '$anomalies', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const hourlyDistribution = await Transaction.aggregate([
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCount,
        amountsByRiskLevel,
        commonAnomalies,
        hourlyDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction stats',
      error: error.message
    });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionStats
};
