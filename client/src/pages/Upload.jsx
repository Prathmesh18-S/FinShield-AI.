import React from 'react';
import { uploadService } from '../services/api';
import CSVUploader from '../components/Upload/CSVUploader';
import { UploadCloud, ShieldCheck, Database, Activity } from 'lucide-react';

const Upload = () => {
  const handleUpload = async (file) => {
    // This will be passed to CSVUploader to handle the actual API call
    return await uploadService.uploadCSV(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div>
        <h1 className="text-gradient" style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <UploadCloud /> Batch Transaction Processing
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          Upload a CSV file of transactions to run them through the 3-pillar anomaly detection engine.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', flex: 1 }}>
        
        {/* Main Upload Area */}
        <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <CSVUploader onUpload={handleUpload} />
        </div>

        {/* Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} /> Engine Pipeline
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ color: 'var(--risk-normal)' }}>1.</div>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Validation</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>CSV sanitization and type checking.</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ color: 'var(--risk-low)' }}>2.</div>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Rule Engine</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>14 sync/async deterministic rules.</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ color: 'var(--risk-medium)' }}>3.</div>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Graph Analysis</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Cycle detection & network topology.</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ color: 'var(--risk-high)' }}>4.</div>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Machine Learning</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Isolation Forest & LOF prediction.</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} /> Required Format
            </h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Your CSV must include the following headers:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: 'var(--text-main)' }}>
                <li><code>transactionId</code></li>
                <li><code>userId</code></li>
                <li><code>recipientId</code></li>
                <li><code>amount</code> (Number)</li>
                <li><code>timestamp</code> (ISO Date)</li>
                <li><code>location</code> (String)</li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Upload;
