/**
 * Graph Builder for Transaction Network
 */
class TransactionGraph {
  constructor() {
    this.adjacencyList = new Map(); // sender -> [{ receiver, amount, timestamp, transactionId }]
    this.reverseAdjacencyList = new Map(); // receiver -> [sender]
    this.nodes = new Set();
  }

  addEdge(sender, receiver, amount, timestamp, transactionId) {
    this.nodes.add(sender);
    this.nodes.add(receiver);

    if (!this.adjacencyList.has(sender)) {
      this.adjacencyList.set(sender, []);
    }
    this.adjacencyList.get(sender).push({ receiver, amount, timestamp, transactionId });

    if (!this.reverseAdjacencyList.has(receiver)) {
      this.reverseAdjacencyList.set(receiver, []);
    }
    this.reverseAdjacencyList.get(receiver).push(sender);
  }

  getNeighbors(node) {
    return this.adjacencyList.get(node) || [];
  }

  getIncomingEdges(node) {
    return this.reverseAdjacencyList.get(node) || [];
  }

  getAllNodes() {
    return Array.from(this.nodes);
  }

  getOutDegree(node) {
    return this.getNeighbors(node).length;
  }

  getInDegree(node) {
    return this.getIncomingEdges(node).length;
  }

  static buildFromTransactions(transactions) {
    const graph = new TransactionGraph();
    for (const tx of transactions) {
      if (tx.userId && tx.recipientId) {
        graph.addEdge(
          tx.userId.toString(),
          tx.recipientId.toString(),
          tx.amount,
          tx.timestamp || tx.createdAt,
          tx.transactionId || (tx._id ? tx._id.toString() : null)
        );
      }
    }
    return graph;
  }
}

module.exports = TransactionGraph;
