import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  Fingerprint,
  ScanFace,
  BellRing,
  QrCode,
  KeyRound,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1: Login Options (Email/Password or Zoho Push), 2: Zoho OneAuth Waiting Screen
  const [email, setEmail] = useState('admin@hariharan.dev');
  const [password, setPassword] = useState('Admin@12345');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaData, setMfaData] = useState(null); // { sessionId, mobileApprovalUrl, tempToken, otpauthUri, secret, user }
  const [showManualTotp, setShowManualTotp] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [zohoLoading, setZohoLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const { login, initiateZohoPush, verifyMfa, setAuthSession } = useAuth();
  const navigate = useNavigate();
  const pollingIntervalRef = useRef(null);

  // Clear polling interval when component unmounts
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Poll for Mobile Approval when on Step 2 (Zoho OneAuth Push)
  useEffect(() => {
    if (step === 2 && mfaData?.sessionId && !isApproved) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await authApi.checkMfaStatus(mfaData.sessionId);
          if (res.data.success && res.data.status === 'APPROVED') {
            clearInterval(pollingIntervalRef.current);
            setIsApproved(true);
            setInfoMessage('✓ Zoho OneAuth mobile approval received! Signing you in...');

            // Store credentials and redirect to dashboard
            setTimeout(() => {
              setAuthSession(res.data.token, res.data.user);
              navigate('/admin');
            }, 900);
          } else if (res.data.status === 'REJECTED') {
            clearInterval(pollingIntervalRef.current);
            setError('Login request was denied on your mobile device.');
          } else if (res.data.status === 'EXPIRED') {
            clearInterval(pollingIntervalRef.current);
            setError('Zoho OneAuth approval session timed out. Please try again.');
          }
        } catch (err) {
          // Continue polling on transient network drops
        }
      }, 2000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [step, mfaData, isApproved]);

  // Option A: Direct Email and Password Sign In
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setInfoMessage('');
      const res = await login(email, password);

      if (res && res.success && res.token) {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Option B: 1-Click Zoho OneAuth Mobile Push Sign In
  const handleZohoPushLogin = async () => {
    try {
      setZohoLoading(true);
      setError('');
      setInfoMessage('');
      const res = await initiateZohoPush(email);

      if (res && res.success) {
        setMfaData(res);
        setStep(2);
        setMfaCode('');
        setInfoMessage('Push notification sent to your Zoho OneAuth mobile app.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch Zoho OneAuth mobile notification.');
    } finally {
      setZohoLoading(false);
    }
  };

  // Simulate Instant Mobile Approval
  const handleSimulateMobileApproval = async () => {
    if (!mfaData?.sessionId) return;
    try {
      setLoading(true);
      setError('');
      const res = await authApi.approveMfa({
        sessionId: mfaData.sessionId,
        biometricUsed: 'Face ID / Fingerprint (Zoho OneAuth)',
      });

      if (res.data.success) {
        setIsApproved(true);
        setInfoMessage('✓ Mobile push approval verified! Signing in...');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve session.');
    } finally {
      setLoading(false);
    }
  };

  // Resend Mobile Push
  const handleResendPush = async () => {
    if (!mfaData?.sessionId) return;
    try {
      setError('');
      const res = await authApi.resendPush({ sessionId: mfaData.sessionId });
      if (res.data.success) {
        setInfoMessage('New push notification dispatched to your Zoho OneAuth app.');
        setTimeout(() => setInfoMessage(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend push notification.');
    }
  };

  // Fallback: Submit Manual 6-Digit TOTP Code
  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.trim().length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

      await verifyMfa(mfaData.tempToken, mfaCode.trim());
      setIsApproved(true);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (mfaData?.secret) {
      navigator.clipboard.writeText(mfaData.secret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div
      style={{
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: step === 1 ? '480px' : '530px',
          padding: '36px 32px',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Step Indicator / Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              background:
                isApproved
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : step === 1
                  ? 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              margin: '0 auto 16px auto',
              boxShadow: isApproved
                ? '0 6px 20px rgba(16, 185, 129, 0.4)'
                : step === 1
                ? '0 6px 20px rgba(2, 132, 199, 0.4)'
                : '0 6px 20px rgba(5, 150, 105, 0.4)',
              transition: 'all 0.3s ease',
            }}
          >
            {isApproved ? (
              <CheckCircle2 size={32} />
            ) : step === 1 ? (
              <ShieldCheck size={30} />
            ) : (
              <Smartphone size={30} />
            )}
          </div>

          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            {isApproved
              ? 'Verification Approved'
              : step === 1
              ? 'Admin Portal Sign In'
              : 'Zoho OneAuth 2FA Mobile'}
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              lineHeight: '1.5',
              maxWidth: '430px',
              margin: '0 auto',
            }}
          >
            {isApproved
              ? 'Mobile biometric check passed. Redirecting to your dashboard...'
              : step === 1
              ? 'Sign in using your email and password, or choose Zoho OneAuth for 1-click mobile push approval.'
              : 'Push notification sent to your Zoho OneAuth mobile app. Approve on your phone to login.'}
          </p>
        </div>

        {/* Info or Success Notification */}
        {infoMessage && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.12)',
              border: `1px solid ${isApproved ? 'rgba(16, 185, 129, 0.35)' : 'rgba(56, 189, 248, 0.3)'}`,
              color: isApproved ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: 'var(--accent-rose)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: DUAL SIGN-IN OPTIONS */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* OPTION 1: EMAIL AND PASSWORD FORM */}
            <form
              onSubmit={handlePasswordLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="admin@hariharan.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || zohoLoading}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In with Password'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* DIVIDER */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '4px 0',
                color: 'var(--text-muted)',
                fontSize: '0.76rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
              <span style={{ padding: '0 12px' }}>OR SIGN IN WITH ZOHO ONEAUTH</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
            </div>

            {/* OPTION 2: 1-CLICK ZOHO ONEAUTH MOBILE PUSH */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.04)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Smartphone size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Zoho OneAuth Mobile Push
                </span>
              </div>

              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Click below to send an instant verification prompt to your phone. Approve with <strong>Face ID</strong> or <strong>Fingerprint</strong> to log in.
              </p>

              <button
                type="button"
                onClick={handleZohoPushLogin}
                disabled={loading || zohoLoading}
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <BellRing size={16} color="var(--accent-cyan)" />
                <span>{zohoLoading ? 'Sending Mobile Push...' : 'Send Zoho OneAuth Mobile Notification'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ZOHO ONEAUTH MOBILE WAITING & APPROVAL SCREEN */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Automatic Mobile Push Waiting Card */}
            <div
              style={{
                background: 'var(--bg-input)',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid var(--border-glass)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Pulsing Radar Ring Icon */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '2px solid var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto',
                  color: 'var(--accent-cyan)',
                }}
              >
                <BellRing size={28} className="animate-pulse" />
              </div>

              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Waiting for Zoho OneAuth Mobile Approval...
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Check your mobile phone for the Zoho OneAuth notification. Tap <strong>Approve</strong> (using Face ID or Fingerprint) to unlock this browser.
              </p>

              {/* Supported Biometrics Badges */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Fingerprint size={14} color="var(--accent-cyan)" /> Fingerprint
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <ScanFace size={14} color="var(--accent-purple)" /> Face ID
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <QrCode size={14} color="var(--accent-emerald)" /> QR Sync
                </span>
              </div>

              {/* Actions: One-Click Instant Approval / Mobile Link */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleSimulateMobileApproval}
                  disabled={loading || isApproved}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.92rem',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{loading ? 'Verifying...' : 'Approve Sign-In (Instant Mobile Approval)'}</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {mfaData?.mobileApprovalUrl && (
                    <a
                      href={mfaData.mobileApprovalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Open Mobile View</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleResendPush}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <RefreshCw size={14} />
                    <span>Resend Push</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Toggle Manual TOTP / QR Code Section */}
            <div
              style={{
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <button
                type="button"
                onClick={() => setShowManualTotp(!showManualTotp)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <KeyRound size={16} color="var(--accent-cyan)" />
                  Alternative: Enter 6-Digit TOTP or Scan QR
                </span>
                {showManualTotp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showManualTotp && (
                <div
                  style={{
                    padding: '16px',
                    borderTop: '1px solid var(--border-glass)',
                    background: 'var(--bg-input)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <form onSubmit={handleMfaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <KeyRound
                        size={18}
                        style={{
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--accent-cyan)',
                        }}
                      />
                      <input
                        type="text"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        inputMode="numeric"
                        placeholder="123456"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="glass-input"
                        style={{
                          paddingLeft: '46px',
                          textAlign: 'center',
                          fontSize: '1.3rem',
                          letterSpacing: '0.3em',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <button
                        type="button"
                        onClick={() => setMfaCode('123456')}
                        style={{
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: 'var(--accent-cyan)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Auto-fill Dev Code (123456)
                      </button>

                      <button
                        type="submit"
                        disabled={loading || mfaCode.length !== 6}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        Verify Code
                      </button>
                    </div>
                  </form>

                  {/* Scannable QR Code for Zoho OneAuth App */}
                  {mfaData?.otpauthUri && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Scan with Zoho OneAuth mobile app:</span>
                      <div
                        style={{
                          padding: '8px',
                          background: '#ffffff',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                            mfaData.otpauthUri
                          )}`}
                          alt="Zoho OneAuth QR Code"
                          width={140}
                          height={140}
                          style={{ display: 'block' }}
                        />
                      </div>

                      {/* Secret Key with copy */}
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: 'var(--bg-glass)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                          color: 'var(--accent-cyan)',
                        }}
                      >
                        <span>{mfaData.secret}</span>
                        <button
                          type="button"
                          onClick={handleCopySecret}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedKey ? 'var(--accent-emerald)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Back to Login Options */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                  setStep(1);
                  setError('');
                  setInfoMessage('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to Sign In Options</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Link */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: 'var(--accent-cyan)',
              fontSize: '0.85rem',
              textDecoration: 'none',
            }}
          >
            &larr; Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
