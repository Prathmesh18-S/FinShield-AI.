/**
 * Graph Analytics Routes
 * Routes for money laundering detection and network analysis
 */
const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const {
  getGraphAnalysis,
  getCycles,
  getNetworkTopology,
} = require("../controllers/graphController");

// All graph routes require authentication
router.use(authenticate);

// GET /api/graph/analysis — run full graph analysis on recent transactions
router.get("/analysis", getGraphAnalysis);

// GET /api/graph/cycles — detect circular money laundering patterns
router.get("/cycles", getCycles);

// GET /api/graph/network — returns network topology metrics
router.get("/network", getNetworkTopology);

module.exports = router;
