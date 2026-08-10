import React, { useState, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const CSVUploader = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('');
  
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        resetStatus();
      } else {
        setUploadStatus('error');
        setStatusMessage('Please upload a valid CSV file.');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      resetStatus();
    }
  };

  const resetStatus = () => {
    setUploadStatus(null);
    setStatusMessage('');
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    setIsUploading(true);
    resetStatus();

    try {
      const response = await onUpload(file);
      setUploadStatus('success');
      setStatusMessage(`Successfully processed batch ${response.data.batchId}. ${response.data.summary.total} transactions inserted.`);
    } catch (err) {
      setUploadStatus('error');
      setStatusMessage(err.response?.data?.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Dropzone */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent-cyan)' : 'var(--border-light)'}`,
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          background: dragActive ? 'rgba(6, 182, 212, 0.05)' : 'rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          cursor: 'pointer'
        }}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%' }}>
          <UploadCloud size={48} color={dragActive ? "var(--accent-cyan)" : "var(--text-muted)"} />
        </div>
        
        <div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Drag & Drop your CSV file here
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            or click to browse your files
          </p>
        </div>
      </div>

      {/* Selected File Details */}
      {file && (
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FileType size={24} color="var(--accent-blue)" />
            <div>
              <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{file.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(2)} KB</div>
            </div>
          </div>
          <button 
            onClick={() => { setFile(null); resetStatus(); }}
            disabled={isUploading}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: isUploading ? 'not-allowed' : 'pointer' }}
          >
            <XCircle size={20} />
          </button>
        </div>
      )}

      {/* Status Messages */}
      {uploadStatus && (
        <div style={{ 
          padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: uploadStatus === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: uploadStatus === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${uploadStatus === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
        }}>
          {uploadStatus === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span style={{ fontSize: '0.875rem' }}>{statusMessage}</span>
        </div>
      )}

      {/* Upload Button */}
      <button 
        onClick={handleSubmit}
        disabled={!file || isUploading || uploadStatus === 'success'}
        style={{
          padding: '1rem', borderRadius: '8px', width: '100%',
          background: (!file || uploadStatus === 'success') ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          color: (!file || uploadStatus === 'success') ? 'var(--text-muted)' : 'white', 
          border: 'none', fontWeight: '600', fontSize: '1rem',
          cursor: (!file || isUploading || uploadStatus === 'success') ? 'not-allowed' : 'pointer',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
          opacity: isUploading ? 0.7 : 1
        }}
      >
        {isUploading ? (
          <><Loader2 size={20} className="spin" /> Processing Batch...</>
        ) : uploadStatus === 'success' ? (
          'Upload Complete'
        ) : (
          'Analyze Transactions'
        )}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default CSVUploader;
