# Risk Engine

# FinShield AI
## Dynamic Fraud Risk Scoring Engine

---

# Purpose

The Risk Engine is responsible for calculating a customer's overall fraud risk score.

Instead of making decisions based on a single suspicious transaction, the Risk Engine combines multiple fraud signals and continuously updates the customer's risk profile.

The calculated score is then used by the Decision Engine to determine the appropriate action.

---

# Objectives

- Evaluate every transaction.
- Combine results from multiple fraud detection modules.
- Maintain a dynamic customer risk score.
- Reduce false positives.
- Support automated decision-making.

---

# Risk Engine Workflow

Transaction Received

↓

Validation Engine

↓

Anomaly Detection Engine

↓

Machine Learning Prediction

↓

Graph Investigation Engine

↓

Risk Score Calculation

↓

Update Risk Profile

↓

Decision Engine

---

# Risk Score Formula

Final Risk Score

=

Rule-Based Score

+

AI Score

+

Graph Score

The final score is always limited between 0 and 100.

---

# Rule-Based Risk Scores

| Rule | Risk Points |
|------|------------:|
| Duplicate Transaction | +25 |
| Future Timestamp | +20 |
| Negative / Zero Amount | +30 |
| High Velocity Transaction | +25 |
| Impossible Location Change | +30 |
| New Device Detected | +15 |
| High-Risk Merchant | +20 |
| Amount Above Customer Average | +20 |

---

# AI Contribution

The Machine Learning model predicts fraud probability.

Example

Fraud Probability

82%

Converted AI Score

+25

Higher fraud probability contributes more to the final risk score.

---

# Graph Investigation Contribution

Graph analysis detects organized fraud.

| Graph Finding | Risk Points |
|--------------|------------:|
| Circular Money Flow | +40 |
| Layering Detected | +35 |
| Fan-Out Pattern | +20 |
| Fan-In Pattern | +20 |
| Suspicious Hub Account | +30 |

---

# Risk Level

| Score | Risk Level |
|-------:|------------|
| 0 – 20 | Low |
| 21 – 40 | Medium |
| 41 – 60 | High |
| 61 – 80 | Critical |
| 81 – 100 | Severe |

---

# Decision Matrix

| Risk Score | Action |
|------------|--------|
| 0 – 20 | Approve Transaction |
| 21 – 40 | Monitor Customer |
| 41 – 60 | Send Warning |
| 61 – 80 | Require OTP Verification |
| 81 – 100 | Temporarily Freeze Account & Create Fraud Case |

---

# Dynamic Risk Profile

Every customer has a continuously updated risk score.

Example

Previous Score

20

↓

Large Amount

+20

↓

Location Conflict

+30

↓

AI Prediction

+18

↓

Graph Score

+15

↓

New Risk Score

83

---

# Risk Decay

If a customer performs only normal transactions over time, the risk score gradually decreases.

Example

Day 1

85

↓

Day 3

75

↓

Day 7

60

↓

Day 15

40

↓

Day 30

20

This prevents customers from remaining permanently high-risk because of old incidents.

---

# Example Calculation

Transaction

₹95,000

Results

Duplicate Transaction

+25

High Velocity

+25

Location Conflict

+30

AI Prediction

+18

Money Laundering Loop

+40

Raw Score

138

Maximum Allowed Score

100

Final Risk Score

100

Decision

Freeze Account

Create Fraud Investigation Case

Notify Fraud Analyst

---

# Why Dynamic Risk Score?

Traditional fraud systems evaluate transactions independently.

FinShield AI evaluates customer behaviour over time.

Advantages

- Better fraud detection
- Fewer false positives
- Continuous customer monitoring
- More realistic banking workflow

---

# Summary

The Risk Engine acts as the central decision-making component of the platform.

It combines:

- Rule-Based Detection
- Machine Learning Prediction
- Graph Investigation

into a single dynamic risk score that enables accurate and explainable fraud prevention.