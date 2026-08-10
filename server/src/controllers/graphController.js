/**
 * Controller for Graph Analytics
 */
const Transaction = require('../models/transactionModel');
const TransactionGraph = require('../graph/graphBuilder');
const { detectCycles, getGraphRiskScore } = require('../graph/cycleDetection');
const { analyzeNetwork, getNetworkRiskScore } = require('../graph/networkAnalysis');

const getRecentTransactions = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return await Transaction.find({ createdAt: { $gte: sevenDaysAgo } });
};

const getGraphAnalysis = async (req, res) => {
  try {
    const transactions = await getRecentTransactions();
    const graph = TransactionGraph.buildFromTransactions(transactions);

    const cycles = detectCycles(graph);
    const cycleRisk = getGraphRiskScore(cycles);

    const networkAnalysis = analyzeNetwork(graph);
    const networkRisk = getNetworkRiskScore(networkAnalysis);

    const totalRiskScore = Math.min(cycleRisk + networkRisk, 100);
    
    let riskLevel = 'Normal';
    if (totalRiskScore > 80) riskLevel = 'Critical, Blocked, Freeze Account';
    else if (totalRiskScore > 60) riskLevel = 'High, Pending, Hold Transaction';
    else if (totalRiskScore > 40) riskLevel = 'Medium, Under Review, Send Warning';
    else if (totalRiskScore > 20) riskLevel = 'Low, Approved, Log Activity';
    else riskLevel = 'Normal, Approved, Allow';

    res.status(200).json({
      success: true,
      data: {
        totalRiskScore,
        riskLevel,
        cycles: cycles.length,
        hubs: networkAnalysis.hubAccounts.length,
        fanOuts: networkAnalysis.fanOutAccounts.length,
        suspiciousCommunities: networkAnalysis.suspiciousCommunities.length
      }
    });
  } catch (error) {
    console.error('Error in getGraphAnalysis:', error);
    res.status(500).json({ success: false, error: 'Failed to perform graph analysis' });
  }
};

const getCycles = async (req, res) => {
  try {
    const transactions = await getRecentTransactions();
    const graph = TransactionGraph.buildFromTransactions(transactions);
    const cycles = detectCycles(graph);

    res.status(200).json({
      success: true,
      count: cycles.length,
      cycles
    });
  } catch (error) {
    console.error('Error in getCycles:', error);
    res.status(500).json({ success: false, error: 'Failed to detect cycles' });
  }
};

const getNetworkTopology = async (req, res) => {
  try {
    const transactions = await getRecentTransactions();
    const graph = TransactionGraph.buildFromTransactions(transactions);
    const networkAnalysis = analyzeNetwork(graph);

    res.status(200).json({
      success: true,
      data: networkAnalysis
    });
  } catch (error) {
    console.error('Error in getNetworkTopology:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze network topology' });
  }
};

module.exports = {
  getGraphAnalysis,
  getCycles,
  getNetworkTopology
};
