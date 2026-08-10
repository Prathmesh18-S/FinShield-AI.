import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>{title}</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>
            {value}
          </div>
        </div>
        <div style={{ 
          background: `rgba(${color}, 0.1)`, 
          padding: '0.75rem', 
          borderRadius: '12px',
          color: `rgb(${color})`
        }}>
          {icon}
        </div>
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
