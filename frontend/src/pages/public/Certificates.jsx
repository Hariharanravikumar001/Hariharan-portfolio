import React, { useState, useEffect } from 'react';
import { Search, Award, ExternalLink, Download, Eye, Calendar, X } from 'lucide-react';
import { certificatesApi } from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Certificates = () => {
  useDocumentTitle('Certifications & Credentials');
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setLoading(true);
        const res = await certificatesApi.getAll({ search: searchTerm.trim() || undefined });
        if (res.data.success) {
          setCertificates(res.data.data);
        }
      } catch (err) {
        console.error('Certificates load error:', err);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchCerts, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 20px 100px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="badge" style={{ marginBottom: '10px' }}>Verified Credentials</span>
        <h1 className="section-title">Licenses & Certifications</h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Industry-recognized certifications and professional credentials validating technical competence.
        </p>

        {/* Search */}
        <div style={{ maxWidth: '500px', margin: '30px auto 0 auto', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search certificates by title, issuer or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input"
            style={{ paddingLeft: '44px' }}
          />
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px',
        }}
      >
        {certificates.map((cert) => (
          <div key={cert._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div
              style={{ position: 'relative', height: '190px', cursor: 'pointer', overflow: 'hidden' }}
              onClick={() => setSelectedCert(cert)}
            >
              <img
                src={cert.imagePreview || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80'}
                alt={cert.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <span className="btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                  <Eye size={15} />
                  <span>Preview Certificate</span>
                </span>
              </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Award size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {cert.issuer}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {cert.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <Calendar size={14} />
                <span>Issued: {cert.issueDate}</span>
                {cert.credentialId && <span>&bull; ID: {cert.credentialId}</span>}
              </div>

              {cert.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px', flex: 1 }}>
                  {cert.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: '0.74rem', padding: '2px 8px', background: 'var(--bg-input)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    <ExternalLink size={13} />
                    <span>Verify</span>
                  </a>
                )}
                {cert.pdfUrl && (
                  <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{selectedCert.title}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{selectedCert.issuer}</span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', background: '#0b0f19' }}>
              <img
                src={selectedCert.imagePreview || selectedCert.pdfUrl}
                alt={selectedCert.title}
                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
