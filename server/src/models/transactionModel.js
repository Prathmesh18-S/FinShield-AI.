const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  recipientId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, required: true, index: true },
  location: { type: String, required: true },
  
  // Risk Assessment
  riskScore: { type: Number, default: 0 },
  riskLevel: { type: String, default: 'Normal', index: true },
  status: { type: String, default: 'Approved' },
  action: { type: String, default: 'Allow' },
  anomalies: [{ type: String }],
  
  // Score Breakdown
  ruleScore: { type: Number, default: 0 },
  graphScore: { type: Number, default: 0 },
  mlScore: { type: Number, default: 0 },
  
  // Graph Analysis Results
  graphAnalysis: {
    inCycle: { type: Boolean, default: false },
    cycleDetails: [{ type: String }],
    isFanOut: { type: Boolean, default: false },
    isHub: { type: Boolean, default: false },
    isBridge: { type: Boolean, default: false }
  },
  
  // Batch tracking
  batchId: { type: String, index: true }
}, {
  timestamps: true
});

// Compound indexes for common queries
transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ recipientId: 1, timestamp: -1 });
transactionSchema.index({ userId: 1, recipientId: 1, amount: 1 });
transactionSchema.index({ riskLevel: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);