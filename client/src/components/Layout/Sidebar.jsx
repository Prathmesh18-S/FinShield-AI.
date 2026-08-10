import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileSpreadsheet, UploadCloud, Settings, ShieldAlert, Shield } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <FileSpreadsheet size={20} /> },
    { name: 'Upload Batch', path: '/upload', icon: <UploadCloud size={20} /> },
    { name: 'Rule Config', path: '#', icon: <Settings size={20} /> },
    { name: 'Fraud Cases', path: '#', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <aside style={{ 
      width: '260px', 
      borderRight: '1px solid var(--border-light)', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'rgba(10, 14, 23, 0.95)'
    }}>
      
      {/* Brand */}
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
          <Shield size={24} color="var(--accent-cyan)" />
        </div>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }} className="text-gradient">FinShield</h2>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem',
              borderRadius: '8px', color: location.pathname === item.path ? '#fff' : 'var(--text-muted)',
              background: location.pathname === item.path ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              border: location.pathname === item.path ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s', fontWeight: location.pathname === item.path ? '500' : '400'
            }}
          >
            <span style={{ color: location.pathname === item.path ? 'var(--accent-cyan)' : 'inherit' }}>
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div style={{ padding: '2rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        FinShield-AI v1.0<br/>Banking Grade Security
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        a:hover { background: rgba(255,255,255,0.05) !important; color: #fff !important; }
      `}} />
    </aside>
  );
};

export default Sidebar;
