const express = require('express');
const router = express.Router();
const { getTransactions, getTransactionById, getTransactionStats } = require('../controllers/transactionController');
const authenticate = require('../middleware/authMiddleware');

// Protect all transaction routes
router.use(authenticate);

// Get transaction statistics
router.get('/stats', getTransactionStats);

// Get paginated list of transactions
router.get('/', getTransactions);

// Get transaction by ID
router.get('/:id', getTransactionById);

module.exports = router;
