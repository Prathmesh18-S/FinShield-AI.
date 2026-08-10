import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      background: 'rgba(10, 14, 23, 0.7)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      
      {/* Search */}
      <div style={{ position: 'relative', width: '300px' }}>
        <Search size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search transaction ID..." 
          style={{
            width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)',
            color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none'
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--risk-critical)', borderRadius: '50%' }}></span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-light)', paddingLeft: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{user?.role || 'System Analyst'}</div>
          </div>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={18} color="#fff" />
          </div>
          <button onClick={logout} title="Logout" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.5rem' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
