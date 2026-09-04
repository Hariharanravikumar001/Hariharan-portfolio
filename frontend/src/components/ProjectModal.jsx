import React, { useState } from 'react';
import { X, ExternalLink, Github, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectModal = ({ project, onClose }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!project) return null;

  const allImages = [
    project.image,
    ...(project.screenshots || []),
  ].filter(Boolean);

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
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
            <span className="badge" style={{ marginBottom: '6px' }}>{project.category}</span>
            <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {project.title}
            </h3>
          </div>
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

        {/* Gallery Slider */}
        {allImages.length > 0 && (
          <div style={{ position: 'relative', width: '100%', height: '360px', background: '#0b0f19', overflow: 'hidden' }}>
            <img
              src={allImages[activeImageIdx]}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={20} />
                </button>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  {allImages.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: i === activeImageIdx ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content Details */}
        <div style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Overview
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
            {project.fullDescription || project.shortDescription}
          </p>

          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
            Technologies Used
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
            {project.technologies?.map((tech, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.82rem',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            {project.liveDemo && (
              <a href={project.liveDemo} target="_blank" rel="noreferrer" className="btn-primary">
                <ExternalLink size={16} />
                <span>Live Demo</span>
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn-secondary">
                <Github size={16} />
                <span>Source Code</span>
              </a>
            )}
            {project.pdfUrl && (
              <a href={project.pdfUrl} target="_blank" rel="noreferrer" className="btn-outline">
                <FileText size={16} />
                <span>Project PDF Document</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
