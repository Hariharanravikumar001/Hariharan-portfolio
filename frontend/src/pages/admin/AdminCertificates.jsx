import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Download, Award, X } from 'lucide-react';
import { certificatesApi } from '../../services/api';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    imagePreview: '',
    pdfUrl: '',
    tags: '',
  });

  const fetchCerts = async () => {
    try {
      const res = await certificatesApi.getAll();
      if (res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load certs:', err);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleEdit = (cert) => {
    setEditingId(cert._id);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      imagePreview: cert.imagePreview || '',
      pdfUrl: cert.pdfUrl || '',
      tags: Array.isArray(cert.tags) ? cert.tags.join(', ') : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate record?')) return;
    try {
      await certificatesApi.delete(id);
      fetchCerts();
    } catch (err) {
      alert('Failed to delete certificate');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };

      if (editingId) {
        await certificatesApi.update(editingId, payload);
      } else {
        await certificatesApi.create(payload);
      }
      setShowModal(false);
      setEditingId(null);
      fetchCerts();
    } catch (err) {
      alert('Error saving certificate: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Certificate Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Maintain professional certifications, verification links, and preview assets.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              issuer: '',
              issueDate: '',
              credentialId: '',
              credentialUrl: '',
              imagePreview: '',
              pdfUrl: '',
              tags: '',
            });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Add Certificate</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {certificates.map((cert) => (
          <div key={cert._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                <Award size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {cert.title}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>{cert.issuer}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Issued: {cert.issueDate} {cert.credentialId && `| ID: ${cert.credentialId}`}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '14px', marginTop: 'auto' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>
                    <ExternalLink size={16} />
                  </a>
                )}
                {cert.pdfUrl && (
                  <a href={cert.pdfUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-emerald)' }}>
                    <Download size={16} />
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(cert)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-cyan)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cert._id)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-rose)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '540px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Certificate' : 'Add Certificate'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Issuer *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Issue Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. May 2024"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Credential ID</label>
                <input
                  type="text"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Credential Verification URL</label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Image Preview URL</label>
                <input
                  type="url"
                  value={formData.imagePreview}
                  onChange={(e) => setFormData({ ...formData, imagePreview: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Certificate PDF URL</label>
                <input
                  type="url"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
