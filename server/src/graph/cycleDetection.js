/**
 * Detect circular money flow (money laundering)
 */
function detectCycles(graph) {
  const nodes = graph.getAllNodes();
  const visited = new Set();
  const recursionStack = new Set();
  const path = [];
  const cycles = [];

  function dfs(node) {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const neighbors = graph.getNeighbors(node);
    for (const edge of neighbors) {
      const neighbor = edge.receiver;
      
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      } else if (recursionStack.has(neighbor)) {
        // Cycle detected
        const cycleStartIndex = path.indexOf(neighbor);
        const cyclePath = path.slice(cycleStartIndex);
        cyclePath.push(neighbor); // Close the cycle

        // Minimum length 3+ implies 4 nodes in cycle path since it closes back to start (e.g. A->B->C->A is 4 nodes, length 3)
        if (cyclePath.length - 1 >= 3) {
          let totalAmount = 0;
          for (let i = 0; i < cyclePath.length - 1; i++) {
            const u = cyclePath[i];
            const v = cyclePath[i + 1];
            const edges = graph.getNeighbors(u);
            const cycleEdge = edges.find(e => e.receiver === v);
            if (cycleEdge) {
              totalAmount += (cycleEdge.amount || 0);
            }
          }
          cycles.push({
            path: cyclePath,
            length: cyclePath.length - 1,
            totalAmount
          });
        }
      }
    }

    recursionStack.delete(node);
    path.pop();
  }

  for (const node of nodes) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  // Filter duplicate permutations of the same cycle
  const uniqueCyclesMap = new Map();
  for (const c of cycles) {
    // Sort all nodes in cycle except the last closing node to form unique key
    const sortedPath = [...c.path.slice(0, -1)].sort().join(',');
    if (!uniqueCyclesMap.has(sortedPath)) {
      uniqueCyclesMap.set(sortedPath, c);
    }
  }

  return Array.from(uniqueCyclesMap.values());
}

function getGraphRiskScore(cycles) {
  if (!cycles || cycles.length === 0) {
    return 0; // Normal, Approved, Allow
  }

  let maxScore = 0;
  for (const cycle of cycles) {
    if (cycle.length >= 3 && cycle.length <= 4) {
      maxScore = Math.max(maxScore, 40); // 21-40: Low, Approved, Log Activity
    } else if (cycle.length >= 5) {
      maxScore = Math.max(maxScore, 50); // 41-60: Medium, Under Review, Send Warning
    }
  }
  return maxScore;
}

module.exports = {
  detectCycles,
  getGraphRiskScore
};
