# System Architecture Diagram

This document illustrates the high-level system architecture and component interactions of FinShield-AI.

## High-Level Architecture

```mermaid
graph TD
    %% User Interfaces
    AdminDashboard["Admin Dashboard (React/Web)"] -->|JWT Authentication| APIGateway

    %% API Gateway & Routing
    subgraph Backend [Node.js / Express Backend]
        APIGateway("Express API Router")
        
        %% Controllers
        UploadCtrl["Upload Controller"]
        TxCtrl["Transaction Controller"]
        DashCtrl["Dashboard Controller"]
        GraphCtrl["Graph Controller"]
        
        APIGateway --> UploadCtrl
        APIGateway --> TxCtrl
        APIGateway --> DashCtrl
        APIGateway --> GraphCtrl
    end

    %% Fraud Detection Pipeline
    subgraph RiskEngine [Fraud Risk Engine]
        UploadCtrl -->|Batch CSV| Validation["CSV Validation"]
        Validation --> RuleEngine["Rule Engine (Orchestrator)"]
        
        RuleEngine --> SyncRules["7 Sync Rules (Per Transaction)"]
        RuleEngine --> AsyncRules["7 Async Rules (Cross-Context)"]
        
        RuleEngine --> RiskAggregator["Risk Aggregator"]
    end

    %% Graph Analytics Engine
    subgraph GraphEngine [Graph Analytics Engine]
        GraphBuilder["Graph Builder"] --> CycleDetection["Cycle Detection (DFS)"]
        GraphBuilder --> NetworkAnalysis["Network Topology Analysis"]
        
        GraphCtrl --> GraphBuilder
        RuleEngine -.->|Queries| GraphBuilder
        CycleDetection --> RiskAggregator
        NetworkAnalysis --> RiskAggregator
    end

    %% Machine Learning Microservice
    subgraph MLService [Python Flask Microservice]
        MLClient["Node.js ML Client"] -->|HTTP/POST| FlaskAPI["Flask API"]
        FlaskAPI --> IsolationForest["Isolation Forest Model"]
        FlaskAPI --> LOF["Local Outlier Factor Model"]
        
        IsolationForest --> MLScore["Ensemble Score"]
        LOF --> MLScore
        
        MLScore --> MLClient
    end

    RuleEngine -.->|Requests prediction| MLClient
    MLClient --> RiskAggregator

    %% Database
    subgraph Database [MongoDB Atlas]
        TxDB[(Transactions Collection)]
        AdminDB[(Admins Collection)]
        
        RiskAggregator -->|Saves Enriched Tx| TxDB
        DashCtrl -->|Aggregates| TxDB
        TxCtrl -->|Reads| TxDB
        GraphBuilder -->|Reads History| TxDB
    end

    %% Styling
    classDef nodejs fill:#8cc84b,stroke:#333,stroke-width:2px,color:#000;
    classDef python fill:#4b8bbe,stroke:#333,stroke-width:2px,color:#fff;
    classDef database fill:#4db33d,stroke:#333,stroke-width:2px,color:#fff;
    classDef engine fill:#f9a826,stroke:#333,stroke-width:2px,color:#000;

    class Backend,UploadCtrl,TxCtrl,DashCtrl,GraphCtrl,APIGateway nodejs;
    class MLService,FlaskAPI,IsolationForest,LOF python;
    class Database,TxDB,AdminDB database;
    class RiskEngine,RuleEngine,SyncRules,AsyncRules,RiskAggregator,GraphEngine,GraphBuilder,CycleDetection,NetworkAnalysis engine;
```

### Component Breakdown

1. **Express Backend**: Handles routing, JWT authentication, and request validation. Exposes endpoints for CSV uploads, dashboard analytics, and graph metrics.
2. **Fraud Risk Engine**: 
    - **Sync Rules**: Checks individual transaction properties (amount, timestamp).
    - **Async Rules**: Queries the database to identify contextual patterns (velocity, impossible travel).
3. **Graph Analytics Engine**: Builds an in-memory graph (adjacency list) to identify multi-hop money laundering cycles (e.g., A → B → C → A) and network anomalies (hubs, fan-outs).
4. **Python ML Microservice**: Exposes a Flask REST API running Scikit-Learn unsupervised anomaly detection models (Isolation Forest, Local Outlier Factor).
5. **MongoDB**: The central data store that tracks transactions, their risk scores, and identified anomalies. Heavy use of compound indexing for performance.
6. **Risk Aggregator**: Computes the final `(0-100)` risk score using weighted contributions: 50% Rules, 30% Graph, 20% ML.
