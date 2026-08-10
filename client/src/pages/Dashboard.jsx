import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import StatCard from '../components/Dashboard/StatCard';
import RecentAlerts from '../components/Dashboard/RecentAlerts';
import { RiskDistributionChart, VolumeChart } from '../components/Dashboard/RiskCharts';
import { Activity, ShieldAlert, Users, TrendingUp, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Poll every 30 seconds for live updates
    const intervalId = setInterval(fetchStats, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
        <Loader2 size={32} className="spin" style={{ marginRight: '1rem', color: 'var(--accent-cyan)' }} /> 
        Loading Analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-gradient" style={{ margin: '0 0 0.5rem 0' }}>Security Overview</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Real-time transaction anomaly detection monitoring.</p>
      </div>

      {/* High-level Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard 
          title="Total Transactions" 
          value={stats?.totalTransactions?.toLocaleString() || 0} 
          icon={<Activity size={24} />} 
          color="59, 130, 246" // Blue
        />
        <StatCard 
          title="Critical Alerts" 
          value={stats?.riskDistribution?.find(r => r._id === 'Critical')?.count || 0} 
          icon={<ShieldAlert size={24} />} 
          color="239, 68, 68" // Red
        />
        <StatCard 
          title="Active Users" 
          value={stats?.riskyUsers?.length || 0} 
          subtitle="Flagged for review"
          icon={<Users size={24} />} 
          color="245, 158, 11" // Amber
        />
        <StatCard 
          title="Avg Risk Score" 
          value={stats?.avgRiskScore ? Math.round(stats.avgRiskScore) : 0} 
          subtitle="Out of 100"
          icon={<TrendingUp size={24} />} 
          color="16, 185, 129" // Emerald
        />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <VolumeChart data={stats?.dailyVolume || []} />
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Top Anomalies Detected</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {stats?.topAnomalies?.length > 0 ? (
                stats.topAnomalies.map((anomaly, index) => (
                  <span key={index} style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--border-light)', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '20px',
                    fontSize: '0.875rem'
                  }}>
                    {anomaly._id} <span style={{ color: 'var(--accent-cyan)', marginLeft: '0.5rem', fontWeight: '600' }}>{anomaly.count}</span>
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No specific anomalies detected yet.</span>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <RiskDistributionChart data={stats?.riskDistribution || []} />
          <RecentAlerts alerts={stats?.recentAlerts || []} />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default Dashboard;
