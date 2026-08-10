/**
 * CSV validation module for checking data integrity of transaction files
 */

const REQUIRED_COLUMNS = ['transaction_id', 'user_id', 'recipient_id', 'amount', 'timestamp', 'location'];

/**
 * Validates a single CSV row
 * @param {Object} row - The parsed CSV row
 * @param {number} index - The row index for error reporting
 * @returns {Object} { isValid, errors }
 */
const validateCSVRow = (row, index) => {
  const errors = [];
  
  // Check required fields
  for (const col of REQUIRED_COLUMNS) {
    if (!row[col] || String(row[col]).trim() === '') {
      errors.push(`Row ${index}: Missing required field '${col}'`);
    }
  }

  // Validate amount is a number
  if (row.amount && isNaN(Number(row.amount))) {
    errors.push(`Row ${index}: Amount '${row.amount}' is not a valid number`);
  }

  // Validate timestamp is a date
  if (row.timestamp && isNaN(Date.parse(row.timestamp))) {
    errors.push(`Row ${index}: Timestamp '${row.timestamp}' is not a valid date`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Checks if all required columns exist in headers
 * @param {string[]} headers - The CSV headers
 * @returns {Object} { isValid, missingColumns }
 */
const validateCSVHeaders = (headers) => {
  if (!headers || !Array.isArray(headers)) {
    return { isValid: false, missingColumns: REQUIRED_COLUMNS };
  }

  const normalizedHeaders = headers.map(h => h.trim().toLowerCase());
  const missingColumns = REQUIRED_COLUMNS.filter(col => !normalizedHeaders.includes(col));
  
  return {
    isValid: missingColumns.length === 0,
    missingColumns
  };
};

/**
 * Sanitizes a string by trimming and removing dangerous characters
 * @param {string} str - The string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  // Remove script tags and potentially dangerous HTML/JS characters
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>'"&;]/g, '')
    .trim();
};

module.exports = {
  validateCSVRow,
  validateCSVHeaders,
  sanitizeString,
  REQUIRED_COLUMNS
};
