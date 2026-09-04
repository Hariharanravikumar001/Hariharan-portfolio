import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Download, Eye, FileText, Check, X, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { resumesApi } from '../../services/api';
import ResumePreviewModal from '../../components/ResumePreviewModal';

const AdminResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Full Stack Developer Resume',
    description: '',
    fileUrl: '',
    fileName: '',
    fileSize: '185 KB',
    version: 'v2.4',
    isActive: true,
    isDefault: false,
  });

  const categories = [
    'Frontend Developer Resume',
    'MERN Stack Developer Resume',
    'Full Stack Developer Resume',
    'Technical Support Engineer Resume',
    'Software Engineer Resume',
    'General Resume',
  ];

  const fetchResumes = async () => {
    try {
      const res = await resumesApi.getAllAdmin();
      if (res.data.success) {
        setResumes(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleEdit = (resume) => {
    setEditingId(resume._id);
    setFormData({
      title: resume.title,
      category: resume.category,
      description: resume.description || '',
      fileUrl: resume.fileUrl,
      fileName: resume.fileName || '',
      fileSize: resume.fileSize || '185 KB',
      version: resume.version || 'v2.4',
      isActive: resume.isActive,
      isDefault: resume.isDefault || false,
    });
    setShowModal(true);
  };

  const handleToggle = async (id) => {
    try {
      const res = await resumesApi.toggleActive(id);
      if (res.data.success) {
        setResumes((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isActive: res.data.data.isActive } : r))
        );
      }
    } catch (err) {
      alert('Failed to toggle resume status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumesApi.delete(id);
      fetchResumes();
    } catch (err) {
      alert('Failed to delete resume');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await resumesApi.update(editingId, formData);
      } else {
        await resumesApi.create(formData);
      }
      setShowModal(false);
      setEditingId(null);
      fetchResumes();
    } catch (err) {
      alert('Error saving resume: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Multi-Resume Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Upload role-specific resumes, enable/disable versions, and track live download telemetry.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              category: 'Full Stack Developer Resume',
              description: '',
              fileUrl: '',
              fileName: 'Hariharan_Ravikumar_Resume.pdf',
              fileSize: '185 KB',
              version: 'v2.4',
              isActive: true,
              isDefault: false,
            });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Upload / Add Resume</span>
        </button>
      </div>

      {/* Resumes Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'var(--bg-input)' }}>
              <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Resume Title & Category</th>
              <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Version</th>
              <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Downloads</th>
              <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</th>
              <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume._id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={20} color="var(--accent-cyan)" />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {resume.title}
                        {resume.isDefault && (
                          <span className="badge" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>Primary</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {resume.category} &bull; {resume.fileSize || '180 KB'}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                  {resume.version || 'v2.4'}
                </td>

                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Download size={14} />
                    <span>{resume.downloadCount || 0}</span>
                  </div>
                </td>

                <td style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => handleToggle(resume._id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: resume.isActive ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                    }}
                  >
                    {resume.isActive ? <ToggleRight size={24} color="var(--accent-emerald)" /> : <ToggleLeft size={24} color="var(--text-muted)" />}
                    <span>{resume.isActive ? 'Active' : 'Disabled'}</span>
                  </button>
                </td>

                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      onClick={() => setPreviewResume(resume)}
                      title="Preview PDF"
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-purple)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => handleEdit(resume)}
                      title="Edit"
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-cyan)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      title="Delete"
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-rose)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Resume Profile' : 'Add New Resume'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Resume Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Developer Resume"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="glass-input"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Resume PDF File URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://.../resume.pdf"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>File Size</label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>File Name</label>
                  <input
                    type="text"
                    value={formData.fileName}
                    onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Description / Focus Area
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active & Visible to Public</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                  <span>Set as Default / Featured Resume</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <span>Save Resume</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewResume && (
        <ResumePreviewModal resume={previewResume} onClose={() => setPreviewResume(null)} />
      )}
    </div>
  );
};

export default AdminResumes;
