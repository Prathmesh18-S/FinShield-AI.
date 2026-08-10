import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const getRiskColor = (level) => {
  switch(level?.toLowerCase()) {
    case 'critical': return 'var(--risk-critical)';
    case 'high': return 'var(--risk-high)';
    case 'medium': return 'var(--risk-medium)';
    case 'low': return 'var(--risk-low)';
    default: return 'var(--risk-normal)';
  }
};

const RecentAlerts = ({ alerts = [] }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', height: '100%' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} color="var(--accent-purple)" /> Recent Alerts
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'var(--text-muted)' }}>
          No recent alerts found.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <ShieldAlert size={20} color="var(--accent-purple)" /> Recent Alerts
        </h3>
        <Link to="/transactions" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
        {alerts.slice(0, 5).map((alert, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            borderLeft: `4px solid ${getRiskColor(alert.riskLevel)}`
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                <AlertTriangle size={16} color={getRiskColor(alert.riskLevel)} />
              </div>
              <div>
                <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{alert.transactionId}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  User: {alert.userId} • {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', color: getRiskColor(alert.riskLevel) }}>
                Score: {alert.riskScore}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {alert.riskLevel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlerts;
