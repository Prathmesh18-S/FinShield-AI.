const fs = require("fs");
const csvParser = require("csv-parser");
const Transaction = require("../models/transactionModel");
const { calculateBatchRisk } = require("../services/fraudDetectionService");
const {
  validateCSVHeaders,
  validateCSVRow,
  sanitizeString,
} = require("../validations/csvValidator");

/**
 * Handles CSV upload, validates rows, calculates risk, and stores in MongoDB.
 */
const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No CSV file uploaded",
      });
    }

    const filePath = req.file.path;
    const transactions = [];
    const validationErrors = [];
    let headersValidated = false;
    let rowIndex = 0;

    // Parse CSV into transaction objects
    await new Promise((resolve, reject) => {
      const stream = fs
        .createReadStream(filePath)
        .pipe(csvParser())
        .on("headers", (headers) => {
          const headerCheck = validateCSVHeaders(headers);
          if (!headerCheck.isValid) {
            stream.destroy();
            return reject(
              new Error(
                `Missing required CSV columns: ${headerCheck.missingColumns.join(", ")}`
              )
            );
          }
          headersValidated = true;
        })
        .on("data", (row) => {
          rowIndex++;
          const rowCheck = validateCSVRow(row, rowIndex);

          if (!rowCheck.isValid) {
            validationErrors.push({
              row: rowIndex,
              errors: rowCheck.errors,
            });
          } else {
            transactions.push({
              transactionId: sanitizeString(row.transaction_id),
              userId: sanitizeString(row.user_id),
              recipientId: sanitizeString(row.recipient_id),
              amount: parseFloat(row.amount),
              timestamp: new Date(row.timestamp),
              location: sanitizeString(row.location),
            });
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Check if any valid transactions were parsed
    if (transactions.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "No valid transactions found in CSV",
        validationErrors,
      });
    }

    // Generate batch ID for tracking
    const batchId = `BATCH-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Calculate risk for all transactions (rule engine + async rules)
    const riskResults = await calculateBatchRisk(transactions, Transaction);

    // Merge transaction data with risk assessment
    const processedTransactions = riskResults.map((enriched) => ({
      transactionId: enriched.transactionId,
      userId: enriched.userId,
      recipientId: enriched.recipientId,
      amount: enriched.amount,
      timestamp: enriched.timestamp,
      location: enriched.location,
      batchId,
      riskScore: enriched.riskScore,
      riskLevel: enriched.riskLevel,
      status: enriched.status,
      action: enriched.action,
      anomalies: enriched.anomalies,
      ruleScore: enriched.ruleScore,
      graphScore: enriched.graphScore,
      mlScore: enriched.mlScore,
    }));

    // Save to MongoDB
    const savedTransactions = await Transaction.insertMany(
      processedTransactions
    );

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: `${savedTransactions.length} transactions processed and stored`,
      batchId,
      totalProcessed: savedTransactions.length,
      totalSkipped: validationErrors.length,
      validationErrors:
        validationErrors.length > 0 ? validationErrors : undefined,
      data: savedTransactions,
    });
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "CSV processing failed",
      error: error.message,
    });
  }
};

module.exports = { uploadCSV };