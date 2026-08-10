/**
 * Impossible Travel Detection
 * Detects if a user transacts from two geographically distant cities
 * in an impossibly short time frame (e.g., Mumbai → London in 5 minutes)
 */
const { isImpossibleTravel } = require("../../utils/cityCoordinates");

const name = "Impossible Travel";

async function evaluate(transaction, context) {
  try {
    const { batchTransactions, Transaction } = context;
    const { userId, location, timestamp } = transaction;

    // location is stored as a plain string (city name)
    if (!location || typeof location !== "string") {
      return { score: 0, anomaly: null };
    }

    const txTime = new Date(timestamp).getTime();
    const currentCity = location.trim();

    // Check within the current batch for transactions from different cities
    if (Array.isArray(batchTransactions)) {
      for (const t of batchTransactions) {
        if (
          t === transaction ||
          t.userId !== userId ||
          !t.location ||
          typeof t.location !== "string"
        ) {
          continue;
        }

        const otherCity = t.location.trim();
        if (otherCity.toLowerCase() === currentCity.toLowerCase()) continue;

        const otherTime = new Date(t.timestamp).getTime();
        const timeGapMs = Math.abs(txTime - otherTime);
        const timeGapMinutes = timeGapMs / 60000;

        // Only check within 30-minute window
        if (timeGapMinutes <= 30) {
          if (isImpossibleTravel(currentCity, otherCity, timeGapMinutes)) {
            return { score: 50, anomaly: "IMPOSSIBLE_TRAVEL" };
          }
        }
      }
    }

    // Check in database for recent transactions from different cities
    if (Transaction) {
      const thirtyMinAgo = new Date(txTime - 30 * 60000);
      const thirtyMinAfter = new Date(txTime + 30 * 60000);

      const dbTxs = await Transaction.find({
        userId,
        location: { $exists: true, $ne: currentCity },
        timestamp: { $gte: thirtyMinAgo, $lte: thirtyMinAfter },
      }).lean();

      for (const prevTx of dbTxs) {
        if (!prevTx.location || typeof prevTx.location !== "string") continue;

        const otherCity = prevTx.location.trim();
        const otherTime = new Date(prevTx.timestamp).getTime();
        const timeGapMinutes = Math.abs(txTime - otherTime) / 60000;

        if (isImpossibleTravel(currentCity, otherCity, timeGapMinutes)) {
          return { score: 50, anomaly: "IMPOSSIBLE_TRAVEL" };
        }
      }
    }

    return { score: 0, anomaly: null };
  } catch (error) {
    console.error(`Error in ${name} rule:`, error);
    return { score: 0, anomaly: null };
  }
}

module.exports = {
  name,
  type: "async",
  evaluate,
};
