const http = require('http');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

/**
 * Send a single transaction to ML service for prediction
 */
const predictSingle = async (transaction) => {
  try {
    const features = extractFeatures(transaction);
    const response = await makeRequest('/predict', features);
    return {
      mlScore: response.mlScore || 0,
      confidence: response.confidence || 0,
      explanation: response.explanation || 'ML service prediction'
    };
  } catch (error) {
    // Graceful fallback — ML service might not be running
    console.warn('ML Service unavailable, using fallback score:', error.message);
    return { mlScore: 0, confidence: 0, explanation: 'ML service unavailable' };
  }
};

/**
 * Send batch of transactions to ML service
 */
const predictBatch = async (transactions) => {
  try {
    const features = transactions.map(extractFeatures);
    const response = await makeRequest('/predict-batch', { transactions: features });
    return response.predictions || transactions.map(() => ({ mlScore: 0, confidence: 0 }));
  } catch (error) {
    console.warn('ML Service unavailable for batch, using fallback:', error.message);
    return transactions.map(() => ({ mlScore: 0, confidence: 0, explanation: 'ML service unavailable' }));
  }
};

/**
 * Extract ML features from a transaction
 */
const extractFeatures = (transaction) => {
  const timestamp = new Date(transaction.timestamp);
  return {
    amount: transaction.amount,
    hour: timestamp.getHours(),
    dayOfWeek: timestamp.getDay(),
    isWeekend: timestamp.getDay() === 0 || timestamp.getDay() === 6 ? 1 : 0,
    isNight: timestamp.getHours() >= 0 && timestamp.getHours() < 5 ? 1 : 0,
    userId: transaction.userId,
    recipientId: transaction.recipientId,
    location: transaction.location
  };
};

/**
 * Make HTTP request to ML service
 */
const makeRequest = (path, data) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, ML_SERVICE_URL);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Invalid ML service response'));
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('ML service timeout'));
    });
    
    req.write(postData);
    req.end();
  });
};

module.exports = { predictSingle, predictBatch, extractFeatures };
