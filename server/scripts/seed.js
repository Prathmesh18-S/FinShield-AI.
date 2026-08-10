/**
 * FinShield-AI — Seed Script
 * Populates MongoDB with test transactions demonstrating ALL fraud patterns
 * Run: node scripts/seed.js
 */

const connectDB = require("../src/database/mongodb");
const Transaction = require("../src/models/transactionModel");

const seedTransactions = async () => {
  try {
    await connectDB();

    console.log("⚠️  WARNING: Clearing existing transactions...");
    await Transaction.deleteMany({});
    console.log("✅ Existing transactions cleared.\n");

    const transactions = [];
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // ─── 1. Normal Transactions (10 txns, risk 0-20) ──────────
    for (let i = 1; i <= 10; i++) {
      transactions.push({
        transactionId: `TXN-NORM-${String(i).padStart(3, "0")}`,
        userId: `USER-${String(i).padStart(3, "0")}`,
        recipientId: `SHOP-${String(i).padStart(3, "0")}`,
        amount: Math.round(Math.random() * 5000 + 500),
        timestamp: new Date(yesterday.getTime() + i * 60000),
        location: "Mumbai",
        riskScore: 0,
        riskLevel: "Normal",
        status: "Approved",
        action: "Allow",
        anomalies: [],
        ruleScore: 0,
        graphScore: 0,
        mlScore: 0,
        batchId: "SEED-BATCH-001",
      });
    }

    // ─── 2. High Amount Transaction ───────────────────────────
    transactions.push({
      transactionId: "TXN-HIGH-001",
      userId: "USER-011",
      recipientId: "LUXURY-001",
      amount: 150000,
      timestamp: new Date(yesterday.getTime() + 15 * 60000),
      location: "Delhi",
      riskScore: 30,
      riskLevel: "Low",
      status: "Approved",
      action: "Log Activity",
      anomalies: ["VERY_HIGH_AMOUNT"],
      ruleScore: 30,
      graphScore: 0,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
    });

    // ─── 3. Duplicate Transactions (replay attack) ────────────
    const dupTime = new Date(yesterday.getTime() + 20 * 60000);
    for (let i = 0; i < 2; i++) {
      transactions.push({
        transactionId: `TXN-DUP-${String(i + 1).padStart(3, "0")}`,
        userId: "USER-012",
        recipientId: "SHOP-012",
        amount: 5000,
        timestamp: new Date(dupTime.getTime() + i * 10000), // 10 seconds apart
        location: "Pune",
        riskScore: 45,
        riskLevel: "Medium",
        status: "Under Review",
        action: "Send Warning",
        anomalies: ["DUPLICATE_TRANSACTION"],
        ruleScore: 45,
        graphScore: 0,
        mlScore: 0,
        batchId: "SEED-BATCH-001",
      });
    }

    // ─── 4. High Velocity (3 txns within 2 seconds) ───────────
    const velTime = new Date(yesterday.getTime() + 25 * 60000);
    for (let i = 0; i < 3; i++) {
      transactions.push({
        transactionId: `TXN-VEL-${String(i + 1).padStart(3, "0")}`,
        userId: "USER-013",
        recipientId: `SHOP-VEL-${i + 1}`,
        amount: 2000 + i * 100,
        timestamp: new Date(velTime.getTime() + i * 500), // 500ms apart
        location: "Bangalore",
        riskScore: 35,
        riskLevel: "Low",
        status: "Approved",
        action: "Log Activity",
        anomalies: ["HIGH_VELOCITY"],
        ruleScore: 35,
        graphScore: 0,
        mlScore: 0,
        batchId: "SEED-BATCH-001",
      });
    }

    // ─── 5. Impossible Travel (Mumbai → London in 5 min) ──────
    const travelTime = new Date(yesterday.getTime() + 30 * 60000);
    transactions.push({
      transactionId: "TXN-TRAVEL-001",
      userId: "USER-014",
      recipientId: "SHOP-MUM-001",
      amount: 3000,
      timestamp: travelTime,
      location: "Mumbai",
      riskScore: 0,
      riskLevel: "Normal",
      status: "Approved",
      action: "Allow",
      anomalies: [],
      ruleScore: 0,
      graphScore: 0,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
    });
    transactions.push({
      transactionId: "TXN-TRAVEL-002",
      userId: "USER-014",
      recipientId: "SHOP-LON-001",
      amount: 5000,
      timestamp: new Date(travelTime.getTime() + 5 * 60000), // 5 minutes later
      location: "London",
      riskScore: 50,
      riskLevel: "Medium",
      status: "Under Review",
      action: "Send Warning",
      anomalies: ["IMPOSSIBLE_TRAVEL"],
      ruleScore: 50,
      graphScore: 0,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
    });

    // ─── 6. Negative Amount ───────────────────────────────────
    transactions.push({
      transactionId: "TXN-NEG-001",
      userId: "USER-015",
      recipientId: "SHOP-015",
      amount: -5000,
      timestamp: new Date(yesterday.getTime() + 40 * 60000),
      location: "Chennai",
      riskScore: 90,
      riskLevel: "Critical",
      status: "Blocked",
      action: "Freeze Account",
      anomalies: ["NEGATIVE_AMOUNT", "INVALID_AMOUNT"],
      ruleScore: 90,
      graphScore: 0,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
    });

    // ─── 7. Zero Amount ──────────────────────────────────────
    transactions.push({
      transactionId: "TXN-ZERO-001",
      userId: "USER-016",
      recipientId: "SHOP-016",
      amount: 0,
      timestamp: new Date(yesterday.getTime() + 45 * 60000),
      location: "Hyderabad",
      riskScore: 80,
      riskLevel: "High",
      status: "Pending",
      action: "Hold Transaction",
      anomalies: ["ZERO_AMOUNT", "INVALID_AMOUNT"],
      ruleScore: 80,
      graphScore: 0,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
    });

    // ─── 8. Future Timestamp ─────────────────────────────────
    transactions.push({
      transactionId: "TXN-FUTURE-001",
      userId: "USER-017",
      recipientId: "SHOP-017",
      amount: 2500,
      timestamp: new Date(now.getTime() + 24 * 60 * 60000), // tomorrow
      location: "Kolkata",
      riskScore: 40,
      riskLevel: "Low",
      status: "Approved",
      action: "Log Activity",
      anomalies: ["FUTURE_TIMESTAMP"],
      ruleScore: 40,
      graphScore: 0,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
    });

    // ─── 9. Night Transaction (2:30 AM) ──────────────────────
    const nightTime = new Date(yesterday);
    nightTime.setHours(2, 30, 0, 0);
    transactions.push({
      transactionId: "TXN-NIGHT-001",
      userId: "USER-018",
      recipientId: "SHOP-018",
      amount: 1500,
      timestamp: nightTime,
      location: "Ahmedabad",
      riskScore: 10,
      riskLevel: "Normal",
      status: "Approved",
      action: "Allow",
      anomalies: ["NIGHT_TRANSACTION"],
      ruleScore: 10,
      graphScore: 0,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
    });

    // ─── 10. Night + High Value ──────────────────────────────
    transactions.push({
      transactionId: "TXN-NIGHT-002",
      userId: "USER-019",
      recipientId: "SHOP-019",
      amount: 75000,
      timestamp: nightTime,
      location: "Jaipur",
      riskScore: 45,
      riskLevel: "Medium",
      status: "Under Review",
      action: "Send Warning",
      anomalies: ["HIGH_VALUE_NIGHT_TRANSACTION", "HIGH_AMOUNT"],
      ruleScore: 45,
      graphScore: 0,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
    });

    // ─── 11. Weekend High Value ──────────────────────────────
    const saturday = new Date(yesterday);
    saturday.setDate(saturday.getDate() + (6 - saturday.getDay()));
    saturday.setHours(14, 0, 0, 0);
    transactions.push({
      transactionId: "TXN-WEEKEND-001",
      userId: "USER-020",
      recipientId: "LUXURY-002",
      amount: 85000,
      timestamp: saturday,
      location: "Delhi",
      riskScore: 35,
      riskLevel: "Low",
      status: "Approved",
      action: "Log Activity",
      anomalies: ["WEEKEND_HIGH_VALUE", "HIGH_AMOUNT"],
      ruleScore: 35,
      graphScore: 0,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
    });

    // ─── 12. Fan-Out Pattern (1 sender → 6 recipients) ───────
    const fanOutTime = new Date(yesterday.getTime() + 60 * 60000);
    for (let i = 1; i <= 6; i++) {
      transactions.push({
        transactionId: `TXN-FANOUT-${String(i).padStart(3, "0")}`,
        userId: "USER-SCAMMER",
        recipientId: `MULE-${String(i).padStart(3, "0")}`,
        amount: 10000,
        timestamp: new Date(fanOutTime.getTime() + i * 60000), // 1 min apart
        location: "Lucknow",
        riskScore: 35,
        riskLevel: "Low",
        status: "Approved",
        action: "Log Activity",
        anomalies: ["FAN_OUT_PATTERN"],
        ruleScore: 35,
        graphScore: 0,
        mlScore: 0,
        batchId: "SEED-BATCH-001",
      });
    }

    // ─── 13. Hub Pattern (6 senders → 1 recipient) ───────────
    const hubTime = new Date(yesterday.getTime() + 70 * 60000);
    for (let i = 1; i <= 6; i++) {
      transactions.push({
        transactionId: `TXN-HUB-${String(i).padStart(3, "0")}`,
        userId: `VICTIM-${String(i).padStart(3, "0")}`,
        recipientId: "USER-MULEMASTER",
        amount: 8000,
        timestamp: new Date(hubTime.getTime() + i * 60000),
        location: "Pune",
        riskScore: 30,
        riskLevel: "Low",
        status: "Approved",
        action: "Log Activity",
        anomalies: ["HUB_PATTERN"],
        ruleScore: 30,
        graphScore: 0,
        mlScore: 0,
        batchId: "SEED-BATCH-001",
      });
    }

    // ─── 14. Circular Pattern (A → B → C → A) ───────────────
    const circTime = new Date(yesterday.getTime() + 80 * 60000);
    transactions.push({
      transactionId: "TXN-CIRC-001",
      userId: "USER-CIRCLE-A",
      recipientId: "USER-CIRCLE-B",
      amount: 50000,
      timestamp: circTime,
      location: "Mumbai",
      riskScore: 85,
      riskLevel: "Critical",
      status: "Blocked",
      action: "Freeze Account",
      anomalies: ["CIRCULAR_PATTERN"],
      ruleScore: 20,
      graphScore: 40,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
      graphAnalysis: { inCycle: true, cycleDetails: ["USER-CIRCLE-A → USER-CIRCLE-B → USER-CIRCLE-C → USER-CIRCLE-A"] },
    });
    transactions.push({
      transactionId: "TXN-CIRC-002",
      userId: "USER-CIRCLE-B",
      recipientId: "USER-CIRCLE-C",
      amount: 50000,
      timestamp: new Date(circTime.getTime() + 60000),
      location: "Delhi",
      riskScore: 85,
      riskLevel: "Critical",
      status: "Blocked",
      action: "Freeze Account",
      anomalies: ["CIRCULAR_PATTERN"],
      ruleScore: 20,
      graphScore: 40,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
      graphAnalysis: { inCycle: true, cycleDetails: ["USER-CIRCLE-A → USER-CIRCLE-B → USER-CIRCLE-C → USER-CIRCLE-A"] },
    });
    transactions.push({
      transactionId: "TXN-CIRC-003",
      userId: "USER-CIRCLE-C",
      recipientId: "USER-CIRCLE-A",
      amount: 50000,
      timestamp: new Date(circTime.getTime() + 120000),
      location: "Bangalore",
      riskScore: 85,
      riskLevel: "Critical",
      status: "Blocked",
      action: "Freeze Account",
      anomalies: ["CIRCULAR_PATTERN"],
      ruleScore: 20,
      graphScore: 40,
      mlScore: 0,
      batchId: "SEED-BATCH-001",
      graphAnalysis: { inCycle: true, cycleDetails: ["USER-CIRCLE-A → USER-CIRCLE-B → USER-CIRCLE-C → USER-CIRCLE-A"] },
    });

    // ─── Insert All ──────────────────────────────────────────
    const result = await Transaction.insertMany(transactions);

    console.log(`✅ Successfully seeded ${result.length} transactions:\n`);
    console.log(`   • Normal transactions:     10`);
    console.log(`   • High amount:              1`);
    console.log(`   • Duplicate (replay):       2`);
    console.log(`   • High velocity:            3`);
    console.log(`   • Impossible travel:        2`);
    console.log(`   • Negative amount:          1`);
    console.log(`   • Zero amount:              1`);
    console.log(`   • Future timestamp:         1`);
    console.log(`   • Night transaction:        2`);
    console.log(`   • Weekend high value:       1`);
    console.log(`   • Fan-out pattern:          6`);
    console.log(`   • Hub pattern:              6`);
    console.log(`   • Circular pattern:         3`);
    console.log(`   ─────────────────────────────`);
    console.log(`   Total:                     ${result.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedTransactions();
