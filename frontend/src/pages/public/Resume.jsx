import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Sparkles,
  CheckCircle2,
  Filter,
  Layers,
} from 'lucide-react';
import { resumesApi } from '../../services/api';
import ResumePreviewModal from '../../components/ResumePreviewModal';

const Resume = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewResume, setPreviewResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Full Stack Developer Resume',
    'MERN Stack Developer Resume',
    'Frontend Developer Resume',
    'Software Engineer Resume',
    'Technical Support Engineer Resume',
  ];

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory === 'All' ? undefined : selectedCategory;
      const res = await resumesApi.getActive(categoryParam);
      if (res.data.success) {
        setResumes(res.data.data);
      }
    } catch (err) {
      console.error('Resumes load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [selectedCategory]);

  const handleDownloadSuccess = (id, newCount) => {
    setResumes((prev) =>
      prev.map((r) => (r._id === id ? { ...r, downloadCount: newCount } : r))
    );
  };

  const handleDirectDownload = async (resume) => {
    try {
      const res = await resumesApi.downloadAndTrack(resume._id);
      if (res.data.success) {
        handleDownloadSuccess(resume._id, res.data.downloadCount);
        window.open(res.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 20px 100px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="badge" style={{ marginBottom: '10px' }}>Multi-Resume Engine</span>
        <h1 className="section-title">Specialized Resumes & CVs</h1>
        <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0 auto' }}>
          Select the resume tailored precisely for your hiring requirements. Each version highlights dedicated skillsets, architectures, and experiences.
        </p>

        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '30px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              {cat.replace(' Resume', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Resumes Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px',
        }}
      >
        {resumes.map((resume) => (
          <div
            key={resume._id}
            className="glass-panel"
            style={{
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              border: resume.isDefault ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--border-glass)',
            }}
          >
            {resume.isDefault && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-cyan)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <Sparkles size={13} />
                <span>Featured / Primary</span>
              </div>
            )}

            {/* Icon & Version Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {resume.title}
                </h3>
                <span className="badge" style={{ marginTop: '4px', fontSize: '0.72rem' }}>
                  {resume.version || 'v2.4'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
              {resume.description ||
                'Tailored professional resume highlighting technical projects, core engineering proficiencies, and system deliverables.'}
            </p>

            {/* Metadata Stats */}
            <div
              style={{
                background: 'var(--bg-input)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="var(--accent-cyan)" />
                <span>Updated: {new Date(resume.lastUpdated || resume.updatedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={14} color="var(--accent-emerald)" />
                <span>Downloads: <strong style={{ color: 'var(--text-primary)' }}>{resume.downloadCount || 0}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setPreviewResume(resume)}
                className="btn-secondary"
                style={{ fontSize: '0.88rem', padding: '10px' }}
              >
                <Eye size={16} />
                <span>Preview PDF</span>
              </button>

              <button
                onClick={() => handleDirectDownload(resume)}
                className="btn-primary"
                style={{ fontSize: '0.88rem', padding: '10px' }}
              >
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Modal Viewer */}
      {previewResume && (
        <ResumePreviewModal
          resume={previewResume}
          onClose={() => setPreviewResume(null)}
          onDownloadSuccess={handleDownloadSuccess}
        />
      )}
    </div>
  );
};

export default Resume;
