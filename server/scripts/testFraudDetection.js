/**
 * FinShield-AI — Fraud Detection Rule Test Suite
 * Tests all 7 synchronous rules by importing actual modules
 * Run: node scripts/testFraudDetection.js
 */

const invalidAmount = require("../src/fraud/rules/invalidAmount");
const negativeAmount = require("../src/fraud/rules/negativeAmount");
const zeroAmount = require("../src/fraud/rules/zeroAmount");
const highAmount = require("../src/fraud/rules/highAmount");
const futureTimestamp = require("../src/fraud/rules/futureTimestamp");
const nightTransaction = require("../src/fraud/rules/nightTransaction");
const weekendHighValue = require("../src/fraud/rules/weekendHighValue");

let passed = 0;
let failed = 0;

const assert = (condition, testName) => {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
};

console.log("╔══════════════════════════════════════════════════════╗");
console.log("║     FinShield-AI — Fraud Rule Test Suite            ║");
console.log("╚══════════════════════════════════════════════════════╝\n");

// ─── Rule 1: Invalid Amount ───────────────────────────
console.log("📋 Rule: Invalid Amount");
let result = invalidAmount.evaluate({ amount: NaN, timestamp: new Date() });
assert(result.score === 50 && result.anomaly === "INVALID_AMOUNT", "NaN amount → +50");

result = invalidAmount.evaluate({ amount: undefined, timestamp: new Date() });
assert(result.score === 50, "undefined amount → +50");

result = invalidAmount.evaluate({ amount: null, timestamp: new Date() });
assert(result.score === 50, "null amount → +50");

result = invalidAmount.evaluate({ amount: 1000, timestamp: new Date() });
assert(result.score === 0, "Valid amount → 0");
console.log();

// ─── Rule 2: Negative Amount ──────────────────────────
console.log("📋 Rule: Negative Amount");
result = negativeAmount.evaluate({ amount: -500, timestamp: new Date() });
assert(result.score === 40 && result.anomaly === "NEGATIVE_AMOUNT", "Negative amount → +40");

result = negativeAmount.evaluate({ amount: 100, timestamp: new Date() });
assert(result.score === 0, "Positive amount → 0");
console.log();

// ─── Rule 3: Zero Amount ─────────────────────────────
console.log("📋 Rule: Zero Amount");
result = zeroAmount.evaluate({ amount: 0, timestamp: new Date() });
assert(result.score === 30 && result.anomaly === "ZERO_AMOUNT", "Zero amount → +30");

result = zeroAmount.evaluate({ amount: 1, timestamp: new Date() });
assert(result.score === 0, "Non-zero amount → 0");
console.log();

// ─── Rule 4: High Amount ─────────────────────────────
console.log("📋 Rule: High Amount");
result = highAmount.evaluate({ amount: 150000, timestamp: new Date() });
assert(result.score === 30 && result.anomaly === "VERY_HIGH_AMOUNT", ">₹1L → +30 VERY_HIGH_AMOUNT");

result = highAmount.evaluate({ amount: 75000, timestamp: new Date() });
assert(result.score === 20 && result.anomaly === "HIGH_AMOUNT", ">₹50K → +20 HIGH_AMOUNT");

result = highAmount.evaluate({ amount: 5000, timestamp: new Date() });
assert(result.score === 0, "₹5K → 0 (normal)");
console.log();

// ─── Rule 5: Future Timestamp ─────────────────────────
console.log("📋 Rule: Future Timestamp");
const futureDate = new Date(Date.now() + 86400000); // tomorrow
result = futureTimestamp.evaluate({ amount: 1000, timestamp: futureDate });
assert(result.score === 40 && result.anomaly === "FUTURE_TIMESTAMP", "Future date → +40");

result = futureTimestamp.evaluate({ amount: 1000, timestamp: new Date(Date.now() - 60000) });
assert(result.score === 0, "Past date → 0");
console.log();

// ─── Rule 6: Night Transaction ────────────────────────
console.log("📋 Rule: Night Transaction");
const nightDate = new Date();
nightDate.setHours(3, 0, 0, 0);

result = nightTransaction.evaluate({ amount: 1000, timestamp: nightDate });
assert(result.score === 10 && result.anomaly === "NIGHT_TRANSACTION", "3 AM low value → +10");

result = nightTransaction.evaluate({ amount: 75000, timestamp: nightDate });
assert(result.score === 25 && result.anomaly === "HIGH_VALUE_NIGHT_TRANSACTION", "3 AM high value → +25");

const dayDate = new Date();
dayDate.setHours(14, 0, 0, 0);
result = nightTransaction.evaluate({ amount: 75000, timestamp: dayDate });
assert(result.score === 0, "2 PM → 0 (daytime)");
console.log();

// ─── Rule 7: Weekend High Value ───────────────────────
console.log("📋 Rule: Weekend High Value");
const saturday = new Date();
saturday.setDate(saturday.getDate() + (6 - saturday.getDay())); // next Saturday
saturday.setHours(10, 0, 0, 0);

result = weekendHighValue.evaluate({ amount: 75000, timestamp: saturday });
assert(result.score === 15 && result.anomaly === "WEEKEND_HIGH_VALUE", "Saturday + ₹75K → +15");

result = weekendHighValue.evaluate({ amount: 1000, timestamp: saturday });
assert(result.score === 0, "Saturday + ₹1K → 0 (low value)");

const monday = new Date();
monday.setDate(monday.getDate() + ((1 - monday.getDay() + 7) % 7 || 7)); // next Monday
result = weekendHighValue.evaluate({ amount: 75000, timestamp: monday });
assert(result.score === 0, "Monday + ₹75K → 0 (weekday)");
console.log();

// ─── Summary ──────────────────────────────────────────
console.log("═══════════════════════════════════════════════════════");
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log("═══════════════════════════════════════════════════════");

if (failed > 0) {
  process.exit(1);
}
