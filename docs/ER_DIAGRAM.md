# Entity-Relationship (ER) Diagram

This document illustrates the data model for the FinShield-AI platform.

## MongoDB ER Diagram

```mermaid
erDiagram
    TRANSACTION {
        ObjectId _id PK
        String transactionId "Indexed"
        String userId "Indexed"
        String recipientId "Indexed"
        Number amount
        Date timestamp "Indexed"
        String location
        String batchId "Indexed"
        
        %% Risk Assessment
        Number riskScore "0-100"
        String riskLevel "Indexed: Normal, Low, Medium, High, Critical"
        String status "Approved, Under Review, Pending, Blocked"
        String action "Allow, Log Activity, Send Warning, Hold Transaction, Freeze Account"
        Array anomalies "List of triggered rules"
        
        %% Score Breakdown
        Number ruleScore
        Number graphScore
        Number mlScore
        
        %% Graph Analysis Results
        Object graphAnalysis "inCycle, cycleDetails, isFanOut, isHub, isBridge"
        
        Date createdAt
        Date updatedAt
    }

    USER {
        String userId PK "Virtual reference, mapped by transaction.userId"
        String accountStatus "Active, Monitored, Frozen"
        Number currentRiskScore "0-100"
    }

    BATCH {
        String batchId PK "Virtual reference, mapped by transaction.batchId"
        Date uploadTime
        Number totalTransactions
    }

    ADMIN {
        ObjectId _id PK
        String name
        String email "Unique, Indexed"
        String password "Hashed"
        String role "Admin, Analyst"
        Date createdAt
        Date updatedAt
    }

    %% Relationships
    USER ||--o{ TRANSACTION : "initiates"
    USER ||--o{ TRANSACTION : "receives"
    BATCH ||--|{ TRANSACTION : "contains"
    ADMIN ||--o{ TRANSACTION : "reviews"
```

### Explanation of Entities

1. **TRANSACTION**: The core entity storing every financial transaction. It includes base details (amount, timestamp, user/recipient), the results of the 14-rule risk engine, ML anomaly scores, and graph network metrics (cycles, fan-out, hub).
2. **USER**: A virtual entity representing the actors (senders and recipients). Risk scores for users are aggregated on-the-fly based on their transaction history.
3. **BATCH**: Represents a CSV upload batch. `batchId` tracks the provenance of transactions processed synchronously.
4. **ADMIN**: The system operators (Fraud Analysts and System Administrators) who review alerts and monitor the dashboard.
