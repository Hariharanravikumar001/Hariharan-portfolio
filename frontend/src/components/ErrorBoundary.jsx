import React from 'react';
import { AlertOctagon, RotateCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portfolio ErrorBoundary caught an exception:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '560px',
              width: '100%',
              textAlign: 'center',
              padding: '48px 32px',
              borderRadius: '20px',
              border: '1px solid rgba(244, 63, 94, 0.25)',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                background: 'rgba(244, 63, 94, 0.12)',
                color: 'var(--accent-rose)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <AlertOctagon size={36} />
            </div>

            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              Something Went Wrong
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                marginBottom: '28px',
              }}
            >
              An unexpected application error occurred while rendering this view. You can reload the page or return safely to the homepage.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReload}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <RotateCw size={16} />
                <span>Reload Page</span>
              </button>

              <a
                href="/"
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Home size={16} />
                <span>Return Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
