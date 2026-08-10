# AI Service

# FinShield AI
## Machine Learning Microservice

---

# Purpose

The AI Service is responsible for analyzing financial transactions using Machine Learning.

Instead of placing AI logic inside the Node.js backend, the project uses a separate Python FastAPI microservice.

This keeps the application modular, scalable, and easier to maintain.

---

# Why Python?

Python provides a mature ecosystem for Machine Learning.

Libraries Used

- Scikit-learn
- XGBoost
- Pandas
- NumPy
- FastAPI

Node.js remains responsible for business logic, authentication, APIs, and database operations.

---

# Why FastAPI?

FastAPI provides:

- High Performance
- Easy REST API Development
- Automatic API Documentation
- Simple integration with Machine Learning models

It acts as a bridge between the Node.js backend and the ML model.

---

# AI Service Workflow

Node.js Sends Transaction

↓

Receive Transaction Data

↓

Extract Features

↓

Preprocess Data

↓

Run ML Model

↓

Predict Fraud Probability

↓

Generate AI Explanation

↓

Return Result to Node.js

---

# Input Features

The AI model receives features such as:

- Transaction Amount
- Payment Method
- Merchant Category
- Device ID
- Location
- Transaction Time
- Transaction Frequency
- Customer Historical Risk Score

These features help the model identify suspicious transaction patterns.

---

# Machine Learning Model

Initial Model

- XGBoost Classifier

Future Models

- Random Forest
- Isolation Forest
- LightGBM

The model predicts the probability that a transaction is fraudulent.

---

# Example Request

Node.js sends:

```json
{
  "transactionId": "TXN1001",
  "amount": 85000,
  "location": "Pune",
  "merchant": "Amazon",
  "paymentMethod": "UPI"
}
```

---

# Example Response

```json
{
  "fraudProbability": 82,
  "aiRiskScore": 25,
  "confidence": 0.91,
  "explanation": "Transaction amount is significantly higher than the customer's normal spending pattern."
}
```

---

# Communication with Backend

Node.js

↓

HTTP Request

↓

FastAPI

↓

Machine Learning Model

↓

Prediction

↓

HTTP Response

↓

Risk Engine

---

# AI Responsibilities

The AI Service is responsible for:

- Predicting fraud probability
- Generating AI risk score
- Providing human-readable explanations

The AI Service is NOT responsible for:

- Authentication
- User Management
- Database Operations
- Freezing Accounts
- Sending Alerts

These responsibilities remain with the Node.js backend.

---

# Advantages of Separate AI Service

- Independent deployment
- Easier model updates
- Better scalability
- Separation of concerns
- Cleaner backend architecture

---

# Future Improvements

- Model Retraining Pipeline
- Explainable AI (SHAP)
- Deep Learning Models
- Streaming Predictions
- Real-Time Feature Store

---

# Summary

The AI Service is an independent Machine Learning microservice.

Its responsibility is to receive transaction data from the Node.js backend, predict fraud probability, generate an AI explanation, and return the results to the Risk Engine.

The final fraud decision is always made by the Risk Engine and Decision Engine, not by the AI model alone.