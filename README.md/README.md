# FinShield-AI

## Intelligent Financial Transaction Anomaly Detection System

> Banking-grade fraud detection platform using Rule-Based Analysis, Graph Analytics, and Machine Learning

---

## Overview

FinShield-AI is a multi-layered financial transaction anomaly detection platform. Instead of binary fraud classification, it employs a **risk scoring system** (0-100) that classifies transactions across five levels:

| Score | Risk Level | Status | Action |
|-------|-----------|--------|--------|
| 0-20 | Normal | Approved | Allow |
| 21-40 | Low | Approved | Log Activity |
| 41-60 | Medium | Under Review | Send Warning |
| 61-80 | High | Pending | Hold Transaction |
| 81-100 | Critical | Blocked | Freeze Account |

---

## Architecture

```
CSV Upload → Validation → Rule Engine (14 Rules) → Risk Score
                                                       ↓
ML Service ─────→ Risk Aggregator ←──── Graph Analytics
                       ↓
          Final Score → MongoDB → Dashboard API
```

### Three-Pillar Risk Scoring

```
Final Score = (Rule Score × 0.5) + (Graph Score × 0.3) + (ML Score × 0.2)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | JWT, bcryptjs |
| **CSV Processing** | Multer, csv-parser |
| **ML Service** | Python, Flask, scikit-learn |
| **Security** | Helmet, CORS, Rate Limiting |

---

## Project Structure

```
FinShield-AI/
├── server/
│   ├── src/
│   │   ├── ai/                    # ML Service Client
│   │   │   └── mlClient.js
│   │   ├── config/                # Environment Configuration
│   │   │   └── env.js
│   │   ├── constants/             # Risk Level Definitions
│   │   │   └── riskLevels.js
│   │   ├── controllers/           # Route Handlers
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── graphController.js
│   │   │   ├── transactionController.js
│   │   │   └── uploadController.js
│   │   ├── database/              # MongoDB Connection
│   │   │   └── mongodb.js
│   │   ├── fraud/                 # Fraud Detection Engine
│   │   │   ├── ruleEngine.js      # Rule Orchestrator
│   │   │   └── rules/             # 14 Individual Rules
│   │   │       ├── invalidAmount.js
│   │   │       ├── negativeAmount.js
│   │   │       ├── zeroAmount.js
│   │   │       ├── highAmount.js
│   │   │       ├── futureTimestamp.js
│   │   │       ├── nightTransaction.js
│   │   │       ├── weekendHighValue.js
│   │   │       ├── duplicateTransaction.js
│   │   │       ├── highVelocity.js
│   │   │       ├── impossibleTravel.js
│   │   │       ├── rapidRecipientChange.js
│   │   │       ├── dormantAccount.js
│   │   │       ├── fanOutDetection.js
│   │   │       └── hubDetection.js
│   │   ├── graph/                 # Graph Analytics
│   │   │   ├── graphBuilder.js
│   │   │   ├── cycleDetection.js
│   │   │   └── networkAnalysis.js
│   │   ├── middleware/            # Express Middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   ├── models/                # Mongoose Models
│   │   │   ├── Admin.js
│   │   │   └── transactionModel.js
│   │   ├── risk-engine/           # Risk Score Aggregation
│   │   │   └── riskAggregator.js
│   │   ├── routes/                # API Routes
│   │   │   ├── authRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── graphRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── uploadRoutes.js
│   │   ├── services/              # Business Logic
│   │   │   ├── authService.js
│   │   │   └── fraudDetectionService.js
│   │   ├── utils/                 # Utilities
│   │   │   └── cityCoordinates.js
│   │   ├── validations/           # Input Validation
│   │   │   └── csvValidator.js
│   │   ├── uploads/               # Temp CSV Storage
│   │   └── app.js                 # Express App
│   ├── scripts/
│   │   ├── createAdmin.js
│   │   ├── seed.js
│   │   └── testFraudDetection.js
│   ├── server.js
│   └── package.json
├── ai-service/                    # Python ML Microservice
│   ├── app.py
│   ├── requirements.txt
│   ├── models/
│   │   ├── isolation_forest.py
│   │   └── lof.py
│   └── utils/
│       └── feature_engineering.py
└── docs/                          # Documentation
```

---

## Fraud Detection Rules (14 Total)

### Synchronous Rules (Per-Transaction)

| # | Rule | Score | Trigger |
|---|------|-------|---------|
| 1 | Invalid Amount | +50 | NaN, null, undefined amount |
| 2 | Negative Amount | +40 | Amount < 0 |
| 3 | Zero Amount | +30 | Amount = 0 |
| 4 | High Amount | +20/+30 | >₹50K (+20) or >₹1L (+30) |
| 5 | Future Timestamp | +40 | Transaction date in future |
| 6 | Night Transaction | +10/+25 | 12AM–5AM (+10), high value at night (+25) |
| 7 | Weekend High Value | +15 | Saturday/Sunday + >₹50K |

### Asynchronous Rules (Cross-Transaction Context)

| # | Rule | Score | Trigger |
|---|------|-------|---------|
| 8 | Duplicate Transaction | +45 | Same user, recipient, amount within 60s |
| 9 | High Velocity | +35 | Same user, >1 transaction within 2s |
| 10 | Impossible Travel | +50 | Mumbai → London in 5 minutes |
| 11 | Rapid Recipient Change | +30 | 3+ different recipients in 1 minute |
| 12 | Dormant Account | +25 | No activity for 30 days, sudden transaction |
| 13 | Fan-Out Detection | +35 | 1 sender → 5+ recipients in 10 minutes |
| 14 | Hub Detection | +30 | 5+ senders → 1 recipient in 10 minutes |

---

## Graph Analytics

### Money Laundering Detection (Cycle Detection)
- Detects circular money flow: A → B → C → A
- Uses DFS-based cycle detection
- Minimum cycle length: 3 nodes

### Network Analysis
- **Hub Accounts**: Nodes receiving from 5+ unique senders
- **Fan-Out Accounts**: Nodes sending to 5+ unique recipients
- **Bridge Accounts**: Articulation points connecting graph components
- **Community Detection**: Label propagation for suspicious clusters
- **Centrality Scores**: Degree centrality per account

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload CSV file |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Full analytics dashboard |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Paginated list (filters: riskLevel, userId, date) |
| GET | `/api/transactions/stats` | Aggregated statistics |
| GET | `/api/transactions/:id` | Single transaction detail |

### Graph Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/graph/analysis` | Full graph analysis |
| GET | `/api/graph/cycles` | Circular pattern detection |
| GET | `/api/graph/network` | Network topology metrics |

> All endpoints except `/api/auth/login` require JWT Bearer token.

---

## CSV Format

```csv
transaction_id,user_id,recipient_id,amount,timestamp,location
TXN-001,USER-001,SHOP-001,2500,2025-12-22 15:05:12,Mumbai
TXN-002,USER-002,USER-003,75000,2025-12-22 02:30:00,Delhi
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Python 3.10+ (for ML service)

### Backend Setup
```bash
cd server
npm install
# Create .env file with MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN
npm run dev
```

### Create Admin User
```bash
cd server
node scripts/createAdmin.js
```

### Seed Test Data
```bash
cd server
node scripts/seed.js
```

### Run Fraud Detection Tests
```bash
cd server
node scripts/testFraudDetection.js
```

### ML Service Setup (Optional)
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

---

## Environment Variables

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
ML_SERVICE_URL=http://localhost:5001
```

---

## Security Features

- **Helmet**: HTTP security headers
- **CORS**: Cross-origin request protection
- **JWT Authentication**: Token-based admin access
- **bcryptjs**: Password hashing (10 rounds)
- **CSV Validation**: Header and row-level validation
- **Input Sanitization**: XSS/injection prevention
- **Global Error Handler**: Catches unhandled errors
- **File Cleanup**: Uploaded CSVs deleted after processing

---

## Author

**Prathmesh Solunke**

Final Year Project — Intelligent Financial Transaction Anomaly Detection System
