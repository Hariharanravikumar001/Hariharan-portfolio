import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  FileText,
  Mail,
  Download,
  Clock,
  ArrowUpRight,
  Plus,
  BarChart,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { analyticsApi } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    totalProjects: 0,
    totalResumes: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalDownloads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await analyticsApi.getOverview();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Overview stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const statCards = [
    {
      title: 'Total Visitors',
      value: stats.totalVisitors,
      sub: `${stats.todayVisitors} visits today`,
      icon: <Users size={24} color="var(--accent-cyan)" />,
      path: '/admin/analytics',
      color: 'var(--accent-cyan)',
    },
    {
      title: 'Projects Cataloged',
      value: stats.totalProjects,
      sub: 'Active in portfolio',
      icon: <Layers size={24} color="var(--accent-purple)" />,
      path: '/admin/projects',
      color: 'var(--accent-purple)',
    },
    {
      title: 'Resumes Managed',
      value: stats.totalResumes,
      sub: '5 specialized categories',
      icon: <FileText size={24} color="var(--accent-emerald)" />,
      path: '/admin/resumes',
      color: 'var(--accent-emerald)',
    },
    {
      title: 'Total Inquiries',
      value: stats.totalMessages,
      sub: `${stats.unreadMessages} unread messages`,
      icon: <Mail size={24} color="var(--accent-amber)" />,
      path: '/admin/messages',
      color: 'var(--accent-amber)',
    },
    {
      title: 'Resume Downloads',
      value: stats.totalDownloads,
      sub: 'Total file retrievals',
      icon: <Download size={24} color="var(--accent-rose)" />,
      path: '/admin/resumes',
      color: 'var(--accent-rose)',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Portfolio Performance Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Real-time metrics, visitor activity, resume download telemetry, and incoming inquiries.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.path}
            className="glass-card"
            style={{
              padding: '22px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {card.title}
              </span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--bg-input)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: card.color, fontWeight: 600 }}>
                {card.sub}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Hub */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '18px' }}>
          Quick Management Actions
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <Link to="/admin/projects" className="btn-primary" style={{ fontSize: '0.88rem' }}>
            <Plus size={16} />
            <span>Add New Project</span>
          </Link>
          <Link to="/admin/resumes" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            <FileText size={16} />
            <span>Upload New Resume</span>
          </Link>
          <Link to="/admin/skills" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            <Plus size={16} />
            <span>Add Skill</span>
          </Link>
          <Link to="/admin/messages" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            <Mail size={16} />
            <span>Review Inbox ({stats.unreadMessages})</span>
          </Link>
          <Link to="/admin/analytics" className="btn-outline" style={{ fontSize: '0.88rem' }}>
            <BarChart size={16} />
            <span>Detailed Analytics</span>
          </Link>
        </div>
      </div>

      {/* Deployment & System Status */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--accent-emerald)" />
            <span>System & Security Status</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>JWT Authentication:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>Active & Encrypted</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Rate Limiting:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>Enforced (Anti-DDoS)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Notification Dispatch:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>SMTP & WhatsApp Ready</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Database Sync:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>MongoDB Atlas Connected</strong>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--accent-purple)" />
            <span>Production Environments</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Frontend Target:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>Vercel Edge Network</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Backend Target:</span>
              <strong style={{ color: 'var(--accent-purple)' }}>Railway Container</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Media Assets:</span>
              <strong style={{ color: 'var(--accent-amber)' }}>Cloudinary CDN / Local</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
