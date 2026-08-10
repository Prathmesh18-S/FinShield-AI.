# Project Presentation Script: FinShield-AI

This script is designed for a 10-15 minute Final Year Project presentation. It is broken down by slides.

---

### Slide 1: Title Slide
**Visual:** Project Title, Your Name, Guide's Name.
**Script:** "Good morning everyone. My name is Prathmesh Solunke, and today I will be presenting my Final Year Project: **FinShield-AI - An Intelligent Financial Transaction Anomaly Detection System**."

---

### Slide 2: Problem Statement
**Visual:** Bullet points highlighting the flaws in current fraud systems (Binary classification, false positives, inability to detect rings).
**Script:** "Modern financial systems process millions of transactions per day. Traditional fraud detection systems often rely on rigid, binary rules. If a transaction breaks a rule, it's flagged as fraud; if not, it passes. This approach has three major flaws: First, it generates a high number of false positives, frustrating customers. Second, it fails to detect complex, multi-account schemes like money laundering. And third, rules become quickly outdated as scammers evolve their tactics. I built FinShield-AI to solve these exact problems."

---

### Slide 3: The Solution (FinShield-AI Overview)
**Visual:** A diagram showing the 3 pillars: Rules + Graph + ML.
**Script:** "FinShield-AI doesn't just label transactions as 'Fraud' or 'Not Fraud'. Instead, it generates a dynamic Risk Score from 0 to 100 based on three separate analytical pillars:
1. A **Deterministic Rule Engine** for immediate, known violations.
2. **Graph Analytics** to detect hidden network structures.
3. **Unsupervised Machine Learning** to catch novel, unknown patterns.
By combining these three, the platform provides a highly accurate, explainable, and multi-layered defense."

---

### Slide 4: System Architecture
**Visual:** The High-Level Architecture Diagram (React -> Node.js -> Python & MongoDB).
**Script:** "Looking at the architecture, the system is built using a microservices approach. The primary backend is built on Node.js and Express, which handles API routing, CSV bulk processing, and database interactions with MongoDB. However, because Node.js is not ideal for heavy machine learning tasks, I decoupled the ML engine into a separate Python Flask microservice. Node.js communicates with Python over HTTP, ensuring that both languages are used for what they do best."

---

### Slide 5: Pillar 1 - The Modular Rule Engine
**Visual:** List of the 14 rules categorized into Sync and Async.
**Script:** "The first layer of defense is the Rule Engine. I implemented 14 distinct rules using the Strategy Design Pattern. These are split into two types: 
- **Synchronous Rules** check stateless data, like if an amount is negative or if a timestamp is in the future.
- **Asynchronous Rules** provide cross-contextual analysis. For example, the 'Impossible Travel' rule uses the Haversine formula to detect if a user made a transaction in Mumbai and then another in London 5 minutes later. To ensure performance, all async rules query MongoDB concurrently using `Promise.all`."

---

### Slide 6: Pillar 2 - Graph Analytics for Money Laundering
**Visual:** A simple graph showing A -> B -> C -> A (Circular Flow).
**Script:** "The second pillar is Graph Analytics. Scammers often use 'money mules' to move stolen funds. If User A sends money to B, who sends it to C, who sends it back to A—this is a classic laundering cycle. Traditional row-by-row analysis completely misses this. I built an in-memory directed graph and implemented a Depth-First Search (DFS) algorithm with cycle detection to uncover these exact money laundering rings, as well as detecting Hub and Fan-out topologies."

---

### Slide 7: Pillar 3 - Unsupervised Machine Learning
**Visual:** Logos of Scikit-Learn, Isolation Forest, LOF.
**Script:** "The third pillar is Machine Learning. Since real-world fraud data is highly imbalanced and lacks clear labels, I utilized Unsupervised Learning algorithms—specifically **Isolation Forest** and **Local Outlier Factor**. These models don't look for what fraud *is*; they look for what is structurally abnormal compared to standard user behavior, allowing the system to catch zero-day fraud tactics."

---

### Slide 8: Risk Aggregation & Action
**Visual:** A table showing the Risk Levels (Normal, Low, Medium, High, Critical) and corresponding Actions.
**Script:** "Finally, the system aggregates the scores from the Rules, Graph, and ML engines into a final 0-100 Risk Score. Based on this score, the system categorizes the transaction into one of 5 tiers. If it's 0-20, it's 'Normal' and allowed. If it's 41-60, it's 'Medium' risk, triggering a warning. If it crosses 80, it is deemed 'Critical', and the system will automatically block the transaction and freeze the account."

---

### Slide 9: Fault Tolerance and Performance
**Visual:** Diagrams showing Stream processing and Fallback mechanism.
**Script:** "When building a banking-grade system, reliability is key. First, to handle massive CSV uploads, I utilized Node.js Streams, which processes data row-by-row, keeping memory usage flat and preventing server crashes. Second, I implemented graceful degradation: if the Python ML microservice crashes, the Node.js backend handles the timeout, defaults the ML score to zero, and continues processing based on Rules and Graphs. The system never goes down."

---

### Slide 10: Conclusion & Future Scope
**Visual:** Future enhancements (Real-time Kafka integration, Deep Learning).
**Script:** "In conclusion, FinShield-AI successfully demonstrates how combining deterministic rules, network graph theory, and machine learning creates a highly resilient fraud detection platform. In the future, this system could be enhanced by replacing the REST API communication with Apache Kafka for true real-time streaming, and by introducing Graph Neural Networks for deeper node analysis. 

Thank you. I am now open to any questions."
