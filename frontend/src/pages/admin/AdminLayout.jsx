import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Cpu,
  Layers,
  FileText,
  Award,
  Mail,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import { contactApi } from '../../services/api';

const AdminLayout = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      contactApi.getMessages({ status: 'new' })
        .then((res) => {
          if (res.data.success) {
            setUnreadCount(res.data.count || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Verifying administrative session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Profile', path: '/admin/profile', icon: <User size={18} /> },
    { name: 'Skills', path: '/admin/skills', icon: <Cpu size={18} /> },
    { name: 'Projects', path: '/admin/projects', icon: <Layers size={18} /> },
    { name: 'Resumes', path: '/admin/resumes', icon: <FileText size={18} /> },
    { name: 'Certificates', path: '/admin/certificates', icon: <Award size={18} /> },
    { name: 'Messages', path: '/admin/messages', icon: <Mail size={18} />, badge: unreadCount > 0 ? unreadCount : null },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 90,
          transition: 'transform 0.3s ease',
          transform: sidebarOpen ? 'translateX(0)' : 'none',
        }}
        className="admin-sidebar"
      >
        {/* Brand */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
            }}
          >
            <Shield size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
              Admin Console
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
              Hariharan Ravikumar
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      background: 'var(--accent-rose)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '10px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {user?.name || 'Administrator'}
            </div>
            <span className="badge" style={{ fontSize: '0.7rem' }}>Admin</span>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ width: '100%', padding: '8px', fontSize: '0.85rem', color: 'var(--accent-rose)' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }} className="admin-main">
        {/* Admin Top Header */}
        <header
          style={{
            height: '64px',
            borderBottom: '1px solid var(--border-glass)',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 80,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sidebar-toggle"
              style={{
                display: 'none',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '6px',
                color: 'var(--text-primary)',
              }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Management Console
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: 'var(--accent-cyan)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <span>View Public Site</span>
              <ExternalLink size={14} />
            </Link>

            <ThemeToggle />
          </div>
        </header>

        {/* Page Content Outlet */}
        <main style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%) !important;
          }
          .admin-sidebar[style*="translateX(0)"] {
            transform: translateX(0) !important;
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .sidebar-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
