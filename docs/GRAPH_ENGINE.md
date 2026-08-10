# Graph Engine

# FinShield AI
## Money Flow Investigation Engine

---

# Purpose

The Graph Engine analyzes relationships between accounts instead of only individual transactions.

Every customer account is represented as a node, and every money transfer is represented as a directed edge.

This allows the platform to detect organized fraud, money laundering patterns, suspicious transaction networks, and fraud rings.

---

# Why Graph Analysis?

Traditional fraud detection checks only one transaction at a time.

The Graph Engine analyzes how money moves across multiple accounts over time.

This provides additional evidence for fraud detection.

---

# Graph Representation

Node

↓

Customer Account

Edge

↓

Money Transfer

Example

A

↓

B

↓

C

↓

D

---

# Graph Workflow

New Transaction

↓

Create Connection

↓

Update Transaction Graph

↓

Analyze Connected Accounts

↓

Detect Suspicious Patterns

↓

Generate Graph Findings

↓

Send Results to Risk Engine

---

# Fraud Patterns Detected

## 1. Circular Money Flow

Example

A → B → C → A

Purpose

Detect circular movement of money that may indicate laundering or coordinated fraud.

---

## 2. Layering

Example

A → B → C → D → E

Purpose

Detect money being passed through multiple accounts to hide its origin.

---

## 3. Fan-Out Pattern

Example

        B
       /
A ────┼────► C
       \
        D

Purpose

Detect one account rapidly distributing money to many accounts.

---

## 4. Fan-In Pattern

Example

A

↓

D

↑

B

↑

C

Purpose

Detect many accounts sending money into one account.

---

## 5. Suspicious Hub

Purpose

Identify accounts connected to an unusually large number of other accounts.

---

# Algorithms

The Graph Engine uses common graph algorithms.

- Breadth First Search (BFS)
- Depth First Search (DFS)
- Cycle Detection
- Connected Components

Future Improvements

- PageRank
- Community Detection
- Centrality Analysis

---

# Graph Output

Example

Transaction

TXN1024

Graph Findings

- Circular Money Flow
- Layering Detected
- Fan-Out Pattern

Graph Risk Score

35

---

# Communication with Risk Engine

The Graph Engine does not freeze accounts.

It only provides graph findings and graph risk points.

The Risk Engine combines:

- Rule-Based Score
- AI Score
- Graph Score

to calculate the final customer risk score.

---

# Advantages

- Detect organized fraud
- Detect money laundering
- Visualize money movement
- Improve fraud investigation
- Reduce false positives

---

# Summary

The Graph Engine transforms individual transactions into a transaction network.

Instead of asking:

"Is this transaction suspicious?"

it answers:

"How is this account connected to other accounts, and does the overall money flow indicate fraudulent behavior?"