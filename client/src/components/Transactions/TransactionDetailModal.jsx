import React from 'react';
import { X, AlertTriangle, Shield, CheckCircle, Activity, TrendingUp } from 'lucide-react';

const getRiskColor = (level) => {
  switch(level?.toLowerCase()) {
    case 'critical': return 'var(--risk-critical)';
    case 'high': return 'var(--risk-high)';
    case 'medium': return 'var(--risk-medium)';
    case 'low': return 'var(--risk-low)';
    default: return 'var(--risk-normal)';
  }
};

const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 100, padding: '2rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '800px', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem', borderBottom: '1px solid var(--border-light)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: `linear-gradient(90deg, rgba(${getRiskColor(transaction.riskLevel).match(/\d+/g)?.join(',') || '255,255,255'}, 0.1), transparent)`
        }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              Transaction Details
              <span style={{ 
                background: getRiskColor(transaction.riskLevel), 
                color: '#fff', padding: '0.25rem 0.75rem', 
                borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' 
              }}>
                {transaction.riskLevel}
              </span>
            </h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              ID: {transaction.transactionId} | Date: {new Date(transaction.timestamp).toLocaleString()}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-main)',
            width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Amount</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                ₹{transaction.amount?.toLocaleString() || 0}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Sender (User ID)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-main)' }}>
                {transaction.userId}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{transaction.location || 'Unknown'}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Recipient ID</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-main)' }}>
                {transaction.recipientId}
              </div>
            </div>
          </div>

          {/* Risk Breakdown */}
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="var(--accent-cyan)" /> Risk Score Breakdown (Final: {transaction.riskScore}/100)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-blue)', fontSize: '1.5rem', fontWeight: 'bold' }}>{transaction.ruleScore || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rule Engine (50%)</div>
              </div>
              <div style={{ border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-purple)', fontSize: '1.5rem', fontWeight: 'bold' }}>{transaction.graphScore || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Graph Analysis (30%)</div>
              </div>
              <div style={{ border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-cyan)', fontSize: '1.5rem', fontWeight: 'bold' }}>{transaction.mlScore || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ML Prediction (20%)</div>
              </div>
            </div>
          </div>

          {/* Triggered Anomalies */}
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="var(--risk-medium)" /> Detected Anomalies
            </h3>
            {transaction.anomalies && transaction.anomalies.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {transaction.anomalies.map((anomaly, idx) => (
                  <li key={idx} style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', 
                    padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    <Shield size={16} /> {anomaly}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', 
                padding: '1rem', borderRadius: '8px', fontSize: '0.875rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <CheckCircle size={16} /> No anomalies detected by rules.
              </div>
            )}
          </div>

          {/* Action Required */}
          <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>System Recommended Action</div>
              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{transaction.action}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {transaction.riskLevel !== 'Normal' && transaction.riskLevel !== 'Low' && (
                <button style={{ 
                  background: 'var(--risk-critical)', color: '#fff', border: 'none', 
                  padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' 
                }}>
                  Freeze Account
                </button>
              )}
              <button style={{ 
                background: 'var(--risk-normal)', color: '#fff', border: 'none', 
                padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' 
              }}>
                Mark as Safe
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
