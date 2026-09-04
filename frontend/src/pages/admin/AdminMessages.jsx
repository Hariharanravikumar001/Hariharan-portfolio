import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Building, Calendar, Trash2, CheckCircle, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { contactApi } from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await contactApi.getMessages({
        search: searchTerm.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchMessages, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, statusFilter]);

  const handleToggleRead = async (msg) => {
    try {
      const updatedRead = !msg.isRead;
      const res = await contactApi.updateStatus(msg._id, { isRead: updatedRead });
      if (res.data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: updatedRead } : m))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await contactApi.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  const handleExportCSV = () => {
    window.open(contactApi.exportCSVUrl(), '_blank');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Contact Inquiries & Messages
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Inspect submissions from portfolio visitors, mark as read, and export communication logs.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn-secondary" style={{ fontSize: '0.88rem' }}>
          <FileSpreadsheet size={16} color="var(--accent-emerald)" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search messages by name, email, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input"
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-input"
          style={{ width: 'auto', minWidth: '160px' }}
        >
          <option value="all">All Inquiries</option>
          <option value="new">New Only</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Messages List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {messages.length === 0 && !loading ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
            No messages found.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="glass-panel"
              style={{
                padding: '24px',
                borderLeft: msg.isRead ? '1px solid var(--border-glass)' : '4px solid var(--accent-cyan)',
                background: msg.isRead ? 'var(--bg-card)' : 'rgba(56, 189, 248, 0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {msg.name}
                    </h3>
                    {!msg.isRead && (
                      <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: 'var(--accent-cyan)' }}>
                        New Message
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={14} color="var(--accent-cyan)" />
                      <a href={`mailto:${msg.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{msg.email}</a>
                    </span>
                    {msg.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={14} color="var(--accent-emerald)" />
                        {msg.phone}
                      </span>
                    )}
                    {msg.company && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building size={14} color="var(--accent-purple)" />
                        {msg.company}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>

                  <button
                    onClick={() => handleToggleRead(msg)}
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>

                  <button
                    onClick={() => handleDelete(msg._id)}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-rose)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Subject & Body */}
              <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px', marginTop: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Subject: {msg.subject}
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
