# Technical Interview Questions

If a technical recruiter or engineering manager reviews your resume and asks about FinShield-AI, these are the deeper technical questions they are likely to ask, along with how to answer them.

---

### 1. "You mentioned handling bulk CSV uploads using Node.js Streams. Why not just use `fs.readFile` and `JSON.parse`?"
**How to answer:** 
"If I used `fs.readFile`, Node.js would attempt to load the entire CSV file into RAM at once. If a bank uploads a 500MB transaction log, it would block the single thread and likely cause an out-of-memory crash. By using `fs.createReadStream` piped to `csv-parser`, I processed the file row-by-row in chunks. This keeps the memory footprint extremely low and flat, regardless of the file size, making the application highly scalable."

### 2. "How did you design the Rule Engine to be scalable?"
**How to answer:** 
"I used a modular approach based on the Strategy design pattern. Instead of one massive `if/else` block, every rule is a standalone file exporting an `evaluate` function. The orchestrator dynamically requires these files. Furthermore, I separated rules into 'sync' and 'async'. Sync rules run instantly, while async rules (which require DB lookups for historical context) are gathered into an array and executed concurrently using `Promise.all`. This significantly reduces the overall wait time."

### 3. "Explain the DFS Cycle Detection you wrote for Money Laundering. What is its time complexity?"
**How to answer:** 
"To detect money laundering rings, I needed to find cycles in a directed graph where money eventually returns to the original sender. I used Depth-First Search (DFS) while maintaining a `visited` set and a `recursionStack` set. When traversing, if a neighbor is already in the `recursionStack`, a back-edge is found, indicating a cycle. The time complexity is `O(V + E)` where V is the number of users (vertices) and E is the number of transactions (edges), because in the worst case, we visit every node and edge once."

### 4. "Your ML microservice is in Python while the main backend is Node.js. How do they communicate, and what happens if Python goes down?"
**How to answer:**
"They communicate over HTTP REST calls. Node.js sends the transaction features to the Flask API. To handle failures, I built fault tolerance into the Node.js ML client. If the `axios` request to Python times out or returns a 500 error, the client catches the exception, logs it, and returns a default `mlScore: 0`. The Risk Aggregator then relies solely on the Rule Engine and Graph Analysis to score the transaction, ensuring the main application never crashes and fraud detection continues gracefully."

### 5. "How did you optimize your MongoDB queries for the async rules?"
**How to answer:**
"Async rules frequently check things like 'How many transactions did User A do in the last 2 seconds?' Doing a full collection scan for this would be incredibly slow. I created **Compound Indexes** on the Mongoose schema, specifically `{ userId: 1, timestamp: -1 }`. Because MongoDB stores this index as a B-Tree, it can instantly jump to the user, and since the timestamp is indexed descending, it can immediately fetch the most recent transactions without scanning the rest of the database."

### 6. "How did you calculate 'Impossible Travel'?"
**How to answer:**
"I used the Haversine formula, which calculates the shortest distance between two points on a sphere using their latitude and longitude. I compared the distance between the city of the current transaction and the city of their previous transaction. Then, I divided that distance by the time gap between the two transactions to find the required travel speed. If the required speed exceeded 900 km/h (a typical commercial jet speed), the system flags it as Impossible Travel."

### 7. "Why use Unsupervised ML (Isolation Forest) instead of a standard Neural Network?"
**How to answer:**
"Standard neural networks or classifiers (like Random Forest) are supervised, meaning they require a dataset heavily labeled with 'Fraud' and 'Not Fraud'. Real financial data is highly imbalanced—maybe 0.1% is fraud—and labeling is expensive. Isolation Forest is unsupervised; it builds random decision trees to isolate anomalies. Anomalies require fewer splits to be isolated compared to normal data points. This allowed me to detect novel, unknown fraud patterns without needing massive labeled datasets."
