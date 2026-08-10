import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

const RISK_COLORS = {
  Normal: '#10b981',
  Low: '#3b82f6',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444'
};

export const RiskDistributionChart = ({ data }) => {
  // Format data for Recharts Pie
  const formattedData = data?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1rem' }}>Risk Distribution</h3>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: 'rgba(10, 14, 23, 0.9)', border: '1px solid var(--border-light)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem', fontSize: '0.8rem' }}>
        {formattedData.map(entry => (
          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: RISK_COLORS[entry.name] || '#ccc' }}></span>
            {entry.name} ({entry.value})
          </div>
        ))}
      </div>
    </div>
  );
};

export const VolumeChart = ({ data }) => {
  // Use area chart for transaction volume over time
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1rem' }}>Transaction Volume (Last 30 Days)</h3>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="_id" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
            <Tooltip 
              contentStyle={{ background: 'rgba(10, 14, 23, 0.9)', border: '1px solid var(--border-light)', borderRadius: '8px' }}
            />
            <Area type="monotone" dataKey="count" name="Transactions" stroke="var(--accent-cyan)" fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
