# Flowcharts

# FinShield AI
## Intelligent Fraud Detection & Money Flow Investigation Platform

---

# Purpose

This document explains how data flows through every major module of the FinShield AI platform.

Instead of focusing on code, it explains the sequence of operations from the moment a user performs an action until the system responds.

These flowcharts help developers understand the complete architecture and execution flow of the application.

---

# 1. User Registration Flow

Purpose

A new user creates an account and receives a virtual bank account inside the Banking Simulator.

Flow

User Opens Registration Page

↓

Enter Personal Details

↓

Validate User Input

↓

Create User

↓

Create Virtual Bank Account

↓

Store User & Account in MongoDB

↓

Registration Successful

---

# 2. User Login Flow

Purpose

Authenticate users and allow secure access using JWT.

Flow

User Login

↓

Verify Email & Password

↓

Generate JWT Token

↓

Return Token

↓

Access Dashboard

---

# 3. Money Transfer Flow

Purpose

Generate a financial transaction that will be analyzed by the Fraud Detection Platform.

Flow

Customer Initiates Transfer

↓

Verify Sender Account

↓

Check Available Balance

↓

Create Transaction

↓

Store Transaction in Database

↓

Trigger Fraud Detection Pipeline

↓

Return Transaction Status

---

# 4. Fraud Detection Pipeline

Purpose

Analyze every transaction before deciding whether it is safe or suspicious.

Flow

Transaction Received

↓

Validation Engine

↓

Duplicate Transaction Check

↓

Timestamp Validation

↓

Amount Validation

↓

Anomaly Detection Engine

↓

High Velocity Detection

↓

Location Conflict Detection

↓

Device Change Detection

↓

Merchant Risk Check

↓

Machine Learning Prediction

↓

Graph Investigation Engine

↓

Risk Score Calculation

↓

Decision Engine

↓

Approve Transaction

OR

Send Warning

OR

Require OTP Verification

OR

Temporarily Freeze Account

---

# 5. Risk Score Flow

Purpose

Maintain a continuously changing fraud risk score for every customer.

Flow

Receive Fraud Analysis

↓

Calculate Rule-Based Score

↓

Add AI Fraud Probability

↓

Add Graph Investigation Score

↓

Calculate Final Risk Score

↓

Update Customer Risk Profile

↓

Store Updated Risk Score

---

# 6. Graph Investigation Flow

Purpose

Track how money moves between accounts and detect organized fraud patterns.

Flow

New Transaction Stored

↓

Build Transaction Graph

↓

Connect Sender & Receiver

↓

Detect Circular Transactions

↓

Detect Layering

↓

Detect Fan-In Pattern

↓

Detect Fan-Out Pattern

↓

Generate Graph Findings

↓

Send Findings to Risk Engine

---

# 7. Decision Engine Flow

Purpose

Automatically decide what action should be taken based on the customer's current risk score.

Flow

Receive Final Risk Score

↓

Is Risk ≤ 20 ?

Yes → Approve Transaction

No

↓

Is Risk ≤ 40 ?

Yes → Monitor Customer

No

↓

Is Risk ≤ 60 ?

Yes → Send Warning Notification

No

↓

Is Risk ≤ 80 ?

Yes → Require OTP Verification

No

↓

Freeze Account

↓

Create Fraud Investigation Case

↓

Notify Fraud Analyst

---

# 8. Fraud Investigation Flow

Purpose

Allow fraud analysts to review suspicious cases.

Flow

Fraud Case Created

↓

Assign Analyst

↓

View AI Explanation

↓

View Transaction History

↓

View Money Flow Graph

↓

Review Evidence

↓

Approve Transaction

OR

Freeze Account

OR

Mark False Positive

↓

Close Investigation

---

# 9. Alert Flow

Purpose

Notify customers and analysts about important fraud-related events.

Flow

Decision Engine

↓

Generate Alert

↓

Store Alert

↓

Notify User

↓

User Reads Alert

↓

Mark Alert as Read

---

# 10. Complete System Flow

Purpose

Shows the end-to-end execution of the entire platform.

Flow

Customer Login

↓

Transfer Money

↓

Transaction Stored

↓

Validation Engine

↓

Anomaly Detection Engine

↓

Machine Learning Prediction

↓

Graph Investigation

↓

Risk Score Engine

↓

Decision Engine

↓

Alert Generated

↓

If Risk Score > Threshold

↓

Create Fraud Case

↓

Notify Fraud Analyst

↓

Update Dashboard

---

# High-Level Architecture Flow

React Frontend

↓

Express Backend

↓

MongoDB

↓

Fraud Detection Engine

├── Validation Engine

├── Anomaly Detection Engine

├── AI Prediction

├── Graph Investigation

└── Risk Score Engine

↓

Decision Engine

↓

Customer Dashboard

↓

Fraud Analyst Dashboard

↓

Admin Dashboard

---

# Summary

Every transaction follows the same lifecycle:

Customer Action

↓

Transaction Creation

↓

Fraud Analysis

↓

Risk Score Calculation

↓

Decision

↓

Notification

↓

Investigation (If Required)

↓

Dashboard Update