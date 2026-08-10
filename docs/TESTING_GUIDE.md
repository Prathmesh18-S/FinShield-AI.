# Testing Guide

This document outlines how to test the various components of the FinShield-AI platform to ensure accurate anomaly detection and system stability.

## 1. Rule Engine Unit Testing

A dedicated test script exists to verify the logic of the 7 synchronous rules without requiring a database connection or ML service.

**How to run:**
```bash
cd server
npm run test:rules
```

**What it tests:**
- Invalid amount handling (NaN, strings)
- Negative and zero amount triggers
- High amount thresholds (>₹50k and >₹1L)
- Future timestamp detection
- Night transaction logic (12 AM - 5 AM)
- Weekend high-value logic

**Expected Output:**
```
╔══════════════════════════════════════════════════════╗
║     FinShield-AI — Fraud Rule Test Suite            ║
╚══════════════════════════════════════════════════════╝

📋 Rule: Invalid Amount
  ✅ PASS: NaN amount → +50
  ...
```

## 2. End-to-End System Testing (Seeding)

The system includes a comprehensive seed script that injects exactly 50 transactions into the database. These transactions are carefully crafted to trigger **every single rule and detection pattern** in the system.

**How to run:**
```bash
cd server
npm run seed
```
*(Warning: This will clear the existing `Transaction` collection in the connected database.)*

**What it tests:**
1. **Normal Transactions**: Ensures baseline transactions receive a `0` score.
2. **Duplicate (Replay)**: Tests the 60-second duplicate transaction rule.
3. **High Velocity**: Tests multiple transactions from one user within 2 seconds.
4. **Impossible Travel**: Validates coordinate distance calculations (e.g., Mumbai to London in 5 minutes).
5. **Fan-Out Pattern**: Verifies 1 sender to multiple recipients logic.
6. **Hub Pattern**: Verifies multiple senders to 1 recipient logic.
7. **Circular Pattern**: Triggers the Graph Engine's DFS cycle detection (Money Laundering).

**Verification:**
After running the script, log into the frontend dashboard (or use API endpoints like GET `/api/dashboard`) to verify that the transactions were correctly scored and categorized (Normal, Low, Medium, High, Critical).

## 3. ML Service API Testing

You can test the Python ML microservice independently using `curl` or Postman.

**Health Check:**
```bash
curl http://localhost:5001/health
# Expected: {"status": "ok"}
```

**Single Prediction:**
```bash
curl -X POST http://localhost:5001/predict \
     -H "Content-Type: application/json" \
     -d '{"amount": 500000, "user_id": "U1", "recipient_id": "R1"}'
```
*Expected Output: JSON containing `risk_score` and `details.isolation_forest`.*

## 4. API Endpoint Testing (Postman)

Import the API collection into Postman (if available) or test manually:

1. **Authentication:**
   - `POST /api/auth/login` - Use credentials created by `npm run create:admin`.
   - Extract the `token` from the response.
2. **Authorization Header:**
   - For all subsequent requests, add Header: `Authorization: Bearer <token>`.
3. **CSV Upload:**
   - `POST /api/upload` (Form-Data)
   - Key: `file` (type: File), Value: select a valid `.csv` file.
4. **Graph Endpoints:**
   - `GET /api/graph/analysis`
   - `GET /api/graph/cycles`

Ensure the backend logs (terminal output) do not display unhandled promise rejections or database errors.
