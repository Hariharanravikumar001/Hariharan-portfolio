import React, { useState } from 'react';
import { X, Download, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { resumesApi } from '../services/api';

const ResumePreviewModal = ({ resume, onClose, onDownloadSuccess }) => {
  const [downloading, setDownloading] = useState(false);

  if (!resume) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await resumesApi.downloadAndTrack(resume._id);
      if (res.data.success) {
        if (onDownloadSuccess) {
          onDownloadSuccess(resume._id, res.data.downloadCount);
        }
        // Trigger actual download or open in new tab
        const downloadWindow = window.open(res.data.downloadUrl, '_blank');
        if (!downloadWindow) {
          // Fallback anchor tag click
          const link = document.createElement('a');
          link.href = res.data.downloadUrl;
          link.download = res.data.fileName || 'Hariharan_Ravikumar_Resume.pdf';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {resume.title}
              </h3>
              <span className="badge">{resume.version || 'v2.4'}</span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {resume.category} &bull; {resume.fileSize || '180 KB'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary"
              style={{ fontSize: '0.88rem', padding: '8px 16px' }}
            >
              <Download size={16} />
              <span>{downloading ? 'Preparing...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div style={{ flex: 1, minHeight: '480px', position: 'relative', background: '#1e293b' }}>
          <iframe
            src={resume.fileUrl}
            title={resume.title}
            width="100%"
            height="100%"
            style={{ border: 'none', minHeight: '520px' }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            <span>Last Updated: {new Date(resume.lastUpdated || resume.updatedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="var(--accent-emerald)" />
            <span>Total Downloads: <strong style={{ color: 'var(--text-primary)' }}>{resume.downloadCount || 0}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewModal;
