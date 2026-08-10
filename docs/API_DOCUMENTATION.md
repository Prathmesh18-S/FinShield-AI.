# API Documentation

# FinShield AI
## Intelligent Fraud Detection & Money Flow Investigation Platform

---

# Purpose

This document defines all REST APIs used in the FinShield AI platform.

It describes:

- API Endpoint
- HTTP Method
- Purpose
- Authentication Required
- Request Body
- Response

These APIs are divided into logical modules.

---

# API Modules

1. Authentication APIs
2. Account APIs
3. Transaction APIs
4. Fraud Analysis APIs
5. Risk Engine APIs
6. Graph Engine APIs
7. Fraud Case APIs
8. Alert APIs
9. Admin APIs

---

# 1. Authentication APIs

## POST /api/auth/register

### Purpose

Register a new user.

### Authentication

No

### Request

```json
{
  "fullName": "Prathmesh Solunke",
  "email": "test@gmail.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Response

```json
{
  "success": true,
  "message": "User Registered Successfully"
}
```

---

## POST /api/auth/login

### Purpose

Authenticate the user and return JWT token.

### Authentication

No

### Request

```json
{
  "email": "test@gmail.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "...",
  "role": "customer"
}
```

---

## GET /api/auth/profile

### Purpose

Returns logged-in user information.

### Authentication

Yes

---

# 2. Account APIs

## POST /api/accounts/create

### Purpose

Create a virtual bank account.

### Authentication

Yes

---

## GET /api/accounts/balance

### Purpose

Returns current account balance.

### Authentication

Yes

---

## GET /api/accounts/:accountNumber

### Purpose

Returns account information.

### Authentication

Yes

---

# 3. Transaction APIs

## POST /api/transactions/transfer

### Purpose

Transfer money from one account to another.

This API triggers the complete Fraud Detection Pipeline.

### Authentication

Yes

### Request

```json
{
  "senderAccount": "ACC1001",
  "receiverAccount": "ACC1002",
  "amount": 50000,
  "paymentMethod": "UPI",
  "merchant": "Amazon",
  "location": "Pune",
  "deviceId": "DEVICE001"
}
```

### Internal Flow

Transfer Request

↓

Create Transaction

↓

Store Transaction

↓

Validation Engine

↓

Anomaly Detection Engine

↓

AI Fraud Prediction

↓

Graph Analysis

↓

Risk Score Calculation

↓

Decision Engine

↓

Return Response

### Response

```json
{
  "status": "SUCCESS",
  "riskScore": 42,
  "decision": "Warning"
}
```

---

## GET /api/transactions/history

### Purpose

Returns transaction history.

### Authentication

Yes

---

## GET /api/transactions/:transactionId

### Purpose

Returns complete transaction details.

### Authentication

Yes

---

# 4. Fraud Analysis APIs

## POST /api/fraud/analyze

### Purpose

Manually analyze a transaction.

Useful for testing.

### Authentication

Admin / Analyst

---

## GET /api/fraud/analysis/:transactionId

### Purpose

Returns fraud analysis results.

### Authentication

Admin / Analyst

### Example Response

```json
{
  "fraudProbability": 91,
  "riskScore": 88,
  "decision": "Freeze",
  "anomalies": [
    "High Velocity",
    "Location Conflict"
  ]
}
```

---

# 5. Risk Engine APIs

## GET /api/risk/:userId

### Purpose

Returns customer's current fraud risk profile.

### Authentication

Admin / Analyst

### Response

```json
{
  "riskScore": 78,
  "riskLevel": "High",
  "warnings": 3
}
```

---

# 6. Graph Engine APIs

## GET /api/graph/:userId

### Purpose

Returns money flow graph for investigation.

### Authentication

Admin / Analyst

### Graph Example

A

↓

B

↓

C

↓

D

---

## GET /api/graph/transaction/:transactionId

### Purpose

Shows complete money flow for a specific transaction.

### Authentication

Admin /Analyst

---

# 7. Fraud Case APIs

## GET /api/fraud-cases

### Purpose

Returns all fraud investigation cases.

### Authentication

Analyst / Admin

---

## GET /api/fraud-cases/:caseId

### Purpose

Returns fraud case details.

### Authentication

Analyst / Admin

---

## PUT /api/fraud-cases/:caseId/review

### Purpose

Update fraud investigation status.

### Authentication

Analyst

### Possible Actions

- Approve Transaction
- Warning
- Freeze Account
- Mark False Positive
- Close Investigation

---

# 8. Alert APIs

## GET /api/alerts

### Purpose

Returns all alerts.

### Authentication

Yes

---

## PUT /api/alerts/:alertId/read

### Purpose

Marks alert as read.

### Authentication

Yes

---

# 9. Admin APIs

## GET /api/admin/dashboard

### Purpose

Returns dashboard statistics.

### Authentication

Admin

---

## GET /api/admin/analytics

### Purpose

Returns fraud analytics.

### Authentication

Admin

---

## PUT /api/admin/risk-rules

### Purpose

Update fraud detection rules.

### Authentication

Admin

---

# Complete API Flow

Client

↓

Express Routes

↓

Controller

↓

Service Layer

↓

Validation

↓

Database

↓

Fraud Engine

↓

Risk Engine

↓

Response

---

# API Security

- JWT Authentication
- Password Hashing
- Role-Based Access Control
- Request Validation
- Error Handling
- Input Sanitization

---

# API Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

# API Summary

| Module | Number of APIs |
|---------|---------------|
| Authentication | 3 |
| Accounts | 3 |
| Transactions | 3 |
| Fraud Analysis | 2 |
| Risk Engine | 1 |
| Graph Engine | 2 |
| Fraud Cases | 3 |
| Alerts | 2 |
| Admin | 3 |

Total APIs: **22**