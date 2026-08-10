import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api';
import TransactionDetailModal from '../components/Transactions/TransactionDetailModal';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, FileSpreadsheet } from 'lucide-react';

const getRiskColor = (level) => {
  switch(level?.toLowerCase()) {
    case 'critical': return 'var(--risk-critical)';
    case 'high': return 'var(--risk-high)';
    case 'medium': return 'var(--risk-medium)';
    case 'low': return 'var(--risk-low)';
    default: return 'var(--risk-normal)';
  }
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTx, setSelectedTx] = useState(null);
  const [filterRisk, setFilterRisk] = useState('');
  const [searchId, setSearchId] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filterRisk) params.riskLevel = filterRisk;
      if (searchId) params.transactionId = searchId;

      const response = await transactionService.getTransactions(params);
      setTransactions(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filterRisk]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient" style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileSpreadsheet /> Transaction Investigation
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Review and manage flagged transactions.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Controls */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', width: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by Transaction ID..." 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={{
                  width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '8px',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)',
                  color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none'
                }}
              />
            </div>
            <button type="submit" style={{ 
              background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', border: '1px solid var(--border-focus)', 
              padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' 
            }}>
              Search
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select 
              value={filterRisk} 
              onChange={(e) => { setFilterRisk(e.target.value); setPage(1); }}
              style={{
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', color: 'var(--text-main)', 
                padding: '0.5rem 1rem', borderRadius: '8px', outline: 'none'
              }}
            >
              <option value="">All Risk Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Loader2 size={32} className="spin" color="var(--accent-cyan)" />
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Transaction ID</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Date & Time</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Sender</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Amount</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Risk Score</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Level</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No transactions found.</td></tr>
                ) : (
                  transactions.map(tx => (
                    <tr 
                      key={tx._id} 
                      onClick={() => setSelectedTx(tx)}
                      style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{tx.transactionId}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{new Date(tx.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{tx.userId}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>₹{tx.amount.toLocaleString()}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: getRiskColor(tx.riskLevel) }}>{tx.riskScore}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          background: `rgba(${getRiskColor(tx.riskLevel).match(/\d+/g)?.join(',') || '255,255,255'}, 0.1)`, 
                          color: getRiskColor(tx.riskLevel), 
                          padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600',
                          border: `1px solid ${getRiskColor(tx.riskLevel)}`
                        }}>
                          {tx.riskLevel}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{tx.action}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Page {page} of {totalPages || 1}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(p => p - 1)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '6px', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '6px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {selectedTx && (
        <TransactionDetailModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default Transactions;
