const RISK_LEVELS = {
  NORMAL: { label: 'Normal', min: 0, max: 20, status: 'Approved', action: 'Allow' },
  LOW: { label: 'Low', min: 21, max: 40, status: 'Approved', action: 'Log Activity' },
  MEDIUM: { label: 'Medium', min: 41, max: 60, status: 'Under Review', action: 'Send Warning' },
  HIGH: { label: 'High', min: 61, max: 80, status: 'Pending', action: 'Hold Transaction' },
  CRITICAL: { label: 'Critical', min: 81, max: 100, status: 'Blocked', action: 'Freeze Account' }
};

const getRiskLevel = (score) => {
  // Clamp score between 0-100
  const clampedScore = Math.min(100, Math.max(0, score));
  if (clampedScore <= 20) return RISK_LEVELS.NORMAL;
  if (clampedScore <= 40) return RISK_LEVELS.LOW;
  if (clampedScore <= 60) return RISK_LEVELS.MEDIUM;
  if (clampedScore <= 80) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
};

module.exports = { RISK_LEVELS, getRiskLevel };
