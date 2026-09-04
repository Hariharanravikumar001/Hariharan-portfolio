import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Briefcase, FileText } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const NotFound = () => {
  useDocumentTitle('404 - Page Not Found');

  return (
    <div
      className="container animate-fade-in"
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '640px',
          width: '100%',
          textAlign: 'center',
          padding: '60px 36px',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Compass icon badge */}
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '20px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
            marginBottom: '24px',
          }}
        >
          <Compass size={38} />
        </div>

        {/* 404 Headline */}
        <div
          className="text-gradient"
          style={{
            fontSize: '5.5rem',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-2px',
            fontFamily: 'var(--font-mono)',
            marginBottom: '12px',
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '14px',
          }}
        >
          Page Lost in Cyberspace
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: '480px',
            margin: '0 auto 36px auto',
          }}
        >
          The page you requested could not be found, was moved, or has drifted beyond reach. Check the URL or head back home.
        </p>

        {/* Quick Link Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Home size={18} />
            <span>Return Home</span>
          </Link>

          <Link to="/projects" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} />
            <span>View Projects</span>
          </Link>

          <Link to="/resume" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} />
            <span>Resume Central</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
