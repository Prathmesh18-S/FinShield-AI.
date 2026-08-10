/**
 * Network topology analysis
 */

function findArticulationPoints(graph) {
  const nodes = graph.getAllNodes();
  const visited = new Set();
  const discoveryTime = new Map();
  const lowestTime = new Map();
  const parent = new Map();
  const articulationPoints = new Set();
  let time = 0;

  function dfs(u) {
    visited.add(u);
    time++;
    discoveryTime.set(u, time);
    lowestTime.set(u, time);
    let children = 0;

    const neighbors = graph.getNeighbors(u).map(e => e.receiver);
    const incoming = graph.getIncomingEdges(u);
    // Treat as undirected for bridge/articulation points
    const adjacent = new Set([...neighbors, ...incoming]);

    for (const v of adjacent) {
      if (!visited.has(v)) {
        parent.set(v, u);
        children++;
        dfs(v);

        lowestTime.set(u, Math.min(lowestTime.get(u) || 0, lowestTime.get(v) || 0));

        if (parent.get(u) === undefined && children > 1) {
          articulationPoints.add(u);
        }
        if (parent.get(u) !== undefined && lowestTime.get(v) >= discoveryTime.get(u)) {
          articulationPoints.add(u);
        }
      } else if (v !== parent.get(u)) {
        lowestTime.set(u, Math.min(lowestTime.get(u) || 0, discoveryTime.get(v) || 0));
      }
    }
  }

  for (const node of nodes) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return Array.from(articulationPoints);
}

function detectCommunities(graph, iterations = 5) {
  const nodes = graph.getAllNodes();
  if (nodes.length === 0) return [];

  let labels = new Map();
  nodes.forEach((node, idx) => labels.set(node, idx));

  for (let i = 0; i < iterations; i++) {
    const shuffledNodes = [...nodes].sort(() => Math.random() - 0.5);
    for (const node of shuffledNodes) {
      const neighbors = graph.getNeighbors(node).map(e => e.receiver);
      const incoming = graph.getIncomingEdges(node);
      const adjacent = [...neighbors, ...incoming];
      
      if (adjacent.length === 0) continue;

      const labelCounts = new Map();
      for (const adj of adjacent) {
        const label = labels.get(adj);
        labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
      }

      let maxCount = 0;
      let bestLabel = labels.get(node);
      for (const [label, count] of labelCounts.entries()) {
        if (count > maxCount) {
          maxCount = count;
          bestLabel = label;
        }
      }
      labels.set(node, bestLabel);
    }
  }

  const communities = new Map();
  for (const [node, label] of labels.entries()) {
    if (!communities.has(label)) {
      communities.set(label, []);
    }
    communities.get(label).push(node);
  }

  return Array.from(communities.values()).filter(group => group.length >= 3);
}

function analyzeNetwork(graph) {
  const nodes = graph.getAllNodes();
  
  const hubAccounts = [];
  const fanOutAccounts = [];
  const centralityScores = {};

  for (const node of nodes) {
    const inDegree = graph.getInDegree(node);
    const outDegree = graph.getOutDegree(node);
    
    if (inDegree >= 5) {
      hubAccounts.push(node);
    }
    if (outDegree >= 5) {
      fanOutAccounts.push(node);
    }
    
    centralityScores[node] = inDegree + outDegree;
  }

  const bridgeAccounts = findArticulationPoints(graph);
  const suspiciousCommunities = detectCommunities(graph);

  return {
    hubAccounts,
    fanOutAccounts,
    bridgeAccounts,
    suspiciousCommunities,
    centralityScores
  };
}

function getNetworkRiskScore(analysis) {
  let score = 0;
  
  if (analysis.hubAccounts.length > 0) score += 10;
  if (analysis.fanOutAccounts.length > 0) score += 15;
  if (analysis.bridgeAccounts.length > 0) score += 10;
  if (analysis.suspiciousCommunities.length > 0) score += 15;

  return Math.min(score, 50);
}

module.exports = {
  analyzeNetwork,
  getNetworkRiskScore
};
