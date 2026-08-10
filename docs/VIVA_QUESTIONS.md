# Final Year Project Viva Questions: FinShield-AI

This document contains a comprehensive list of likely Viva (oral examination) questions related to the FinShield-AI project, along with their ideal answers.

---

### Core Project Concept

**Q1: What is the main objective of FinShield-AI?**
**A:** The objective is to build a "Banking-Grade Financial Transaction Anomaly Detection Platform." Unlike basic systems that classify transactions in binary terms (Fraud / Not Fraud), FinShield-AI uses a three-pillar approach (Rules, Graph Analytics, Machine Learning) to generate a granular risk score (0-100) and assigns an actionable risk tier (Normal, Low, Medium, High, Critical).

**Q2: Why did you use three different methods (Rules, Graph, ML) instead of just Machine Learning?**
**A:** Machine learning is great at finding hidden patterns, but it lacks explainability and can have false positives. Rule-based systems provide guaranteed detection for known fraud types (e.g., negative amounts, future dates). Graph analytics detects structural money laundering (e.g., circular flow) which ML models analyzing individual rows would miss. Combining all three provides robustness, explainability, and comprehensive coverage.

---

### Architecture and Backend

**Q3: Explain the MERN stack used in this project.**
**A:** The backend is built on Node.js and Express, which handles the core business logic, CSV parsing, and API routing. MongoDB is used as the NoSQL database to store transactions because of its flexible schema and excellent aggregation pipeline capabilities. (Note: The UI/React part is handled separately; the backend provides REST APIs for it).

**Q4: Why did you use Python for the ML service instead of Node.js?**
**A:** Python has a vastly superior ecosystem for Machine Learning (Scikit-Learn, Pandas). Trying to run complex ML models natively in Node.js is inefficient. Using a microservice architecture (Node.js backend + Python Flask ML API) allows each language to do what it does best, while decoupling the components for better scalability.

**Q5: How does the Rule Engine work in your backend?**
**A:** I designed a modular Rule Engine using the Strategy pattern. I created 14 separate rule files divided into "Sync Rules" (stateless checks like amounts/dates) and "Async Rules" (stateful checks requiring DB lookups, like velocity and dormant accounts). The orchestrator runs all sync rules sequentially, and uses `Promise.all` for async rules to optimize performance.

---

### Algorithms and Implementation Details

**Q6: Explain how you implemented the "Impossible Travel" rule.**
**A:** The rule checks if a user makes two transactions from different cities within an impossibly short timeframe. I implemented a coordinate mapping utility with latitude/longitude for major cities and used the **Haversine formula** to calculate the great-circle distance between them. If the required speed to travel that distance in the given time gap exceeds 900 km/h (commercial flight speed), it flags it as impossible travel.

**Q7: How did you implement Graph Analytics and Cycle Detection for Money Laundering?**
**A:** I built an in-memory directed graph (using an Adjacency List) where nodes are Users/Accounts and edges are Transactions. To detect money laundering (A → B → C → A), I implemented a **Depth First Search (DFS)** algorithm with a recursion stack. If the DFS encounters a node that is currently in the recursion stack, it means a cycle is found.

**Q8: Which Machine Learning models did you use and why?**
**A:** I used **Isolation Forest** and **Local Outlier Factor (LOF)** from Scikit-Learn. These are *unsupervised* learning models. In real-world fraud detection, labeled fraud data is extremely rare and highly imbalanced. Unsupervised models work by isolating anomalies based on their distance/density from normal transactions, rather than needing to learn from labeled examples.

**Q9: How did you handle bulk CSV uploads efficiently?**
**A:** I used the `csv-parser` library in Node.js, which processes the CSV as a Stream rather than loading the entire file into memory at once. For database insertion, I aggregated the processed transactions into an array and used `Transaction.insertMany()`, which is a highly optimized bulk database operation in MongoDB, preventing the DB from being overwhelmed by thousands of individual save requests.

---

### Risk Aggregation and Security

**Q10: How is the final Risk Score calculated?**
**A:** The Risk Aggregator takes the scores from the three pillars and applies a weighted formula: `(Rule Score × 0.5) + (Graph Score × 0.3) + (ML Score × 0.2)`. The rule engine has the highest weight because it represents definitive, deterministic violations. However, if any single pillar returns a critical score (>80), the aggregator forces the final score into the critical tier to ensure severe threats are not diluted.

**Q11: What happens if the Python ML microservice crashes during a transaction?**
**A:** The Node.js ML Client implements a graceful fallback mechanism. If the HTTP request to the Flask API fails or times out, the client logs the error and returns a default `mlScore: 0`. The transaction is still processed based on the Rule and Graph engines, ensuring the platform remains highly available and resilient to partial outages.

**Q12: What security measures did you implement in the backend?**
**A:** 
1. **Helmet.js** to set secure HTTP headers.
2. **CORS** configuration to prevent unauthorized origins.
3. **JWT (JSON Web Tokens)** for stateless, secure admin authentication.
4. **Bcryptjs** to hash admin passwords with 10 salt rounds.
5. **Input Validation & Sanitization** on CSV uploads to strip dangerous characters (XSS protection).
