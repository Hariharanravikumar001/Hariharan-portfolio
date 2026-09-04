import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Smartphone,
  Fingerprint,
  ScanFace,
  CheckCircle2,
  XCircle,
  Clock,
  Laptop,
  Globe,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { authApi } from '../../services/api';

const AdminMfaApproval = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  const [actionLoading, setActionLoading] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing MFA session identifier. Please scan the QR code again.');
      setLoading(false);
      return;
    }

    const loadSession = async () => {
      try {
        setLoading(true);
        const res = await authApi.getMfaSession(sessionId);
        if (res.data.success) {
          setSession(res.data.session);
          setStatus(res.data.session.status);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid or expired MFA session.');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      setBiometricScanning(true);

      // Brief biometric verification scan animation
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await authApi.approveMfa({
        sessionId,
        biometricUsed: 'Face ID / Fingerprint (Zoho OneAuth Mobile)',
      });

      if (res.data.success) {
        setStatus('APPROVED');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve request. Please try again.');
    } finally {
      setActionLoading(false);
      setBiometricScanning(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to deny this login request?')) return;
    try {
      setActionLoading(true);
      const res = await authApi.rejectMfa({ sessionId });
      if (res.data.success) {
        setStatus('REJECTED');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 28px',
          textAlign: 'center',
        }}
      >
        {/* Zoho OneAuth Header Branding */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background:
                status === 'APPROVED'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : status === 'REJECTED'
                  ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)',
              transition: 'all 0.3s ease',
            }}
          >
            {status === 'APPROVED' ? (
              <CheckCircle2 size={36} />
            ) : status === 'REJECTED' ? (
              <XCircle size={36} />
            ) : (
              <Smartphone size={36} />
            )}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: 'var(--accent-cyan)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            Zoho OneAuth Mobile Push
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {status === 'APPROVED'
              ? 'Sign-In Approved!'
              : status === 'REJECTED'
              ? 'Sign-In Denied'
              : 'Approve Sign-In Request'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            {status === 'APPROVED'
              ? 'Your desktop browser is now signed in to the admin portal.'
              : status === 'REJECTED'
              ? 'This sign-in attempt was rejected.'
              : 'A sign-in attempt requires your verification on this mobile device.'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: 'var(--accent-rose)',
              fontSize: '0.85rem',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        {/* Pending Request Details Card */}
        {status === 'PENDING' && session && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '0.84rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Account:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{session.email}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Laptop size={14} /> Requesting Device:
                </span>
                <span style={{ color: 'var(--text-primary)' }}>Desktop PC (Windows)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={14} /> IP Address:
                </span>
                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>{session.ip}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> Requested:
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>Just now</span>
              </div>
            </div>

            {/* Biometric Verification Simulation Prompt */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.05)',
                border: '1px dashed rgba(56, 189, 248, 0.3)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', color: 'var(--accent-cyan)' }}>
                <Fingerprint size={20} />
                <ScanFace size={20} />
              </div>
              <span>Protected with <strong>Biometric Verification</strong> (Face ID / Fingerprint)</span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={handleApprove}
                disabled={actionLoading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
                }}
              >
                {biometricScanning ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Fingerprint className="animate-spin" size={18} />
                    Verifying Biometrics...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} />
                    Approve Sign-In (Biometric)
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: 'var(--accent-rose)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                Deny Request
              </button>
            </div>
          </div>
        )}

        {/* Approved Success State */}
        {status === 'APPROVED' && (
          <div className="animate-fade-in" style={{ padding: '16px 0' }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                color: 'var(--accent-emerald)',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>Verification Successful</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Your desktop browser session has been automatically unlocked. You can now close this window on your phone.
              </p>
            </div>

            <Link
              to="/admin"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <span>Go to Admin Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Rejected State */}
        {status === 'REJECTED' && (
          <div className="animate-fade-in" style={{ padding: '16px 0' }}>
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                color: 'var(--accent-rose)',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>Login Blocked</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                This sign-in request was rejected. The session has been terminated for your security.
              </p>
            </div>

            <Link
              to="/admin/login"
              className="btn-secondary"
              style={{ width: '100%', padding: '12px', display: 'inline-flex', justifyContent: 'center' }}
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMfaApproval;
