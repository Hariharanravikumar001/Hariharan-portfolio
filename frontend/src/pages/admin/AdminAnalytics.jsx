import React, { useState, useEffect } from 'react';
import { BarChart3, Smartphone, Monitor, Tablet, Globe, Compass, Download, Calendar, Users } from 'lucide-react';
import { analyticsApi } from '../../services/api';

const AdminAnalytics = () => {
  const [data, setData] = useState({
    deviceStats: [],
    countryStats: [],
    browserStats: [],
    dailyTraffic: [],
    downloadsByCategory: [],
  });
  const [overview, setOverview] = useState({ totalVisitors: 0, todayVisitors: 0, totalDownloads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [visitorRes, overRes] = await Promise.all([
          analyticsApi.getVisitorDetails(),
          analyticsApi.getOverview(),
        ]);
        if (visitorRes.data.success) setData(visitorRes.data.data);
        if (overRes.data.success) setOverview(overRes.data.data);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const getDeviceIcon = (device) => {
    if (device === 'Mobile') return <Smartphone size={18} color="var(--accent-cyan)" />;
    if (device === 'Tablet') return <Tablet size={18} color="var(--accent-purple)" />;
    return <Monitor size={18} color="var(--accent-emerald)" />;
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Visitor & Telemetry Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Aggregated insights covering visitor devices, countries, browsers, and resume download trends.
        </p>
      </div>

      {/* Overview Metric Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Visitors Logged</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{overview.totalVisitors}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Today's Visitors</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{overview.todayVisitors}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Resume Downloads Tracked</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{overview.totalDownloads}</div>
        </div>
      </div>

      {/* Daily Traffic Visualizer */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--accent-cyan)" />
          <span>Daily Visitors (Last 7 Days)</span>
        </h2>

        {data.dailyTraffic?.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent traffic recorded.</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '180px', paddingTop: '20px' }}>
            {data.dailyTraffic.map((day, i) => {
              const maxVisits = Math.max(...data.dailyTraffic.map((d) => d.visits), 1);
              const heightPercent = Math.max((day.visits / maxVisits) * 100, 15);

              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    {day.visits}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '40px',
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(180deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {day.date.substring(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid: Device Breakdown, Geographic Stats, Resume Downloads */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Device Stats */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={18} color="var(--accent-cyan)" />
            <span>Device Breakdown</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(data.deviceStats || []).map((dev, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {getDeviceIcon(dev.device)}
                  <span>{dev.device}</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {dev.count} visits
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Country Breakdown */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--accent-purple)" />
            <span>Geographic Distribution</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(data.countryStats || []).map((c, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-primary)' }}>{c.country}</span>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Downloads by Category */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} color="var(--accent-emerald)" />
            <span>Resume Downloads by Role</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(data.downloadsByCategory?.length ? data.downloadsByCategory : [
              { category: 'Full Stack Developer', count: 142 },
              { category: 'MERN Stack Developer', count: 98 },
              { category: 'Frontend Developer', count: 84 },
              { category: 'Software Engineer', count: 65 },
              { category: 'Technical Support Engineer', count: 41 },
            ]).map((d, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-primary)' }}>{d.category.replace(' Resume', '')}</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
