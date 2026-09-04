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
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1: Login Options, 2: Zoho OneAuth MFA Modes Screen
  const [activeMfaMode, setActiveMfaMode] = useState('push'); // 'push' | 'qr' | 'biometric' | 'totp'
  const [email, setEmail] = useState('admin@hariharan.dev');
  const [password, setPassword] = useState('Admin@12345');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaData, setMfaData] = useState(null); // { sessionId, mobileApprovalUrl, tempToken, otpauthUri, secret, user }
  const [copiedKey, setCopiedKey] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [zohoLoading, setZohoLoading] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
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

  // Poll for Mobile Approval when on Step 2 (for push, qr, or biometric modes)
  useEffect(() => {
    if (step === 2 && mfaData?.sessionId && !isApproved) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await authApi.checkMfaStatus(mfaData.sessionId);
          if (res.data.success && res.data.status === 'APPROVED') {
            clearInterval(pollingIntervalRef.current);
            setIsApproved(true);
            setInfoMessage('✓ Zoho OneAuth verification approved! Signing you in...');

            // Store credentials and redirect to dashboard
            setTimeout(() => {
              setAuthSession(res.data.token, res.data.user);
              navigate('/admin');
            }, 900);
          } else if (res.data.status === 'REJECTED') {
            clearInterval(pollingIntervalRef.current);
            setError('Sign-in request was denied on your mobile device.');
          } else if (res.data.status === 'EXPIRED') {
            clearInterval(pollingIntervalRef.current);
            setError('Zoho OneAuth session timed out. Please try again.');
          }
        } catch (err) {
          // Keep polling on transient network drops
        }
      }, 2000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [step, mfaData, isApproved]);

  // Option A: Direct Email & Password Sign In
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

  // Option B: Select & Launch a Zoho OneAuth MFA Mode
  const handleStartZohoMfaMode = async (mode = 'push') => {
    try {
      setZohoLoading(true);
      setActiveMfaMode(mode);
      setError('');
      setInfoMessage('');

      const res = await initiateZohoPush(email);
      if (res && res.success) {
        setMfaData(res);
        setStep(2);
        setMfaCode('');

        if (mode === 'push') {
          setInfoMessage('Push notification dispatched to your Zoho OneAuth mobile app.');
        } else if (mode === 'qr') {
          setInfoMessage('Scan the QR code on screen using your Zoho OneAuth app.');
        } else if (mode === 'biometric') {
          setInfoMessage('Ready for biometric touch authentication.');
        } else {
          setInfoMessage('Enter the 6-digit TOTP code from your Zoho OneAuth app.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize Zoho OneAuth MFA session.');
    } finally {
      setZohoLoading(false);
    }
  };

  // Mode 1: Simulate Instant Mobile Approval
  const handleSimulateMobileApproval = async () => {
    if (!mfaData?.sessionId) return;
    try {
      setLoading(true);
      setError('');
      const res = await authApi.approveMfa({
        sessionId: mfaData.sessionId,
        biometricUsed: 'Push Notification Approved (Zoho OneAuth)',
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

  // Mode 2: Simulate Mobile QR Code Scan
  const handleSimulateQrScan = async () => {
    if (!mfaData?.sessionId) return;
    try {
      setLoading(true);
      setError('');
      const res = await authApi.approveMfa({
        sessionId: mfaData.sessionId,
        biometricUsed: 'QR Code Scan (Zoho OneAuth Mobile)',
      });

      if (res.data.success) {
        setIsApproved(true);
        setInfoMessage('✓ QR Code verified by Zoho OneAuth app! Signing in...');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify QR scan.');
    } finally {
      setLoading(false);
    }
  };

  // Mode 3: Biometric Touch Authentication Trigger
  const handleBiometricAuthenticate = async () => {
    if (!mfaData?.sessionId) return;
    try {
      setBiometricScanning(true);
      setError('');

      // Simulate biometric sensor engagement
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await authApi.approveMfa({
        sessionId: mfaData.sessionId,
        biometricUsed: 'Face ID / Fingerprint (Biometric Authentication)',
      });

      if (res.data.success) {
        setIsApproved(true);
        setInfoMessage('✓ Biometric authentication successful! Signing in...');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Biometric authentication failed.');
    } finally {
      setBiometricScanning(false);
    }
  };

  // Mode 4: Submit Manual 6-Digit TOTP Code
  const handleTotpSubmit = async (e) => {
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

  // Resend Push
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
          maxWidth: step === 1 ? '500px' : '560px',
          padding: '36px 30px',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              background: isApproved
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
              marginBottom: '6px',
            }}
          >
            {isApproved
              ? 'Verification Approved'
              : step === 1
              ? 'Admin Portal Sign In'
              : 'Zoho OneAuth MFA Verification'}
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              lineHeight: '1.5',
              maxWidth: '440px',
              margin: '0 auto',
            }}
          >
            {isApproved
              ? 'Authentication confirmed. Redirecting to your dashboard...'
              : step === 1
              ? 'Sign in directly with your email & password, or choose a Zoho OneAuth MFA mode.'
              : 'Select your preferred Zoho OneAuth MFA mode below to complete authentication.'}
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
              marginBottom: '18px',
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
              marginBottom: '18px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: DUAL SIGN-IN (DIRECT PASSWORD + ZOHO MFA MODES) */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* OPTION 1: EMAIL AND PASSWORD FORM */}
            <form
              onSubmit={handlePasswordLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
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
                margin: '2px 0',
                color: 'var(--text-muted)',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
              <span style={{ padding: '0 12px' }}>OR CHOOSE ZOHO ONEAUTH MFA MODE</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
            </div>

            {/* ZOHO ONEAUTH MFA MODES SELECTOR GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {/* Mode 1: Mobile Push */}
              <button
                type="button"
                onClick={() => handleStartZohoMfaMode('push')}
                disabled={loading || zohoLoading}
                className="glass-card"
                style={{
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  background: 'rgba(56, 189, 248, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <BellRing size={20} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    RECOMMENDED
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Mobile Push
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    1-Tap prompt on phone
                  </div>
                </div>
              </button>

              {/* Mode 2: QR Code Sign-In */}
              <button
                type="button"
                onClick={() => handleStartZohoMfaMode('qr')}
                disabled={loading || zohoLoading}
                className="glass-card"
                style={{
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <QrCode size={20} color="var(--accent-emerald)" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    FAST
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    QR Code Sign-in
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Scan with Zoho OneAuth
                  </div>
                </div>
              </button>

              {/* Mode 3: Biometric Touch */}
              <button
                type="button"
                onClick={() => handleStartZohoMfaMode('biometric')}
                disabled={loading || zohoLoading}
                className="glass-card"
                style={{
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  background: 'rgba(168, 85, 247, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Fingerprint size={20} color="var(--accent-purple)" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-purple)', background: 'rgba(168, 85, 247, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    SECURE
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Biometrics
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Face ID / Touch Sensor
                  </div>
                </div>
              </button>

              {/* Mode 4: 6-Digit TOTP Code */}
              <button
                type="button"
                onClick={() => handleStartZohoMfaMode('totp')}
                disabled={loading || zohoLoading}
                className="glass-card"
                style={{
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  background: 'rgba(245, 158, 11, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <KeyRound size={20} color="var(--accent-amber)" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    OFFLINE
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    6-Digit TOTP
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Time-based code in app
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ZOHO ONEAUTH MFA MODES SCREEN */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* MFA Mode Navigation Tabs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
                background: 'var(--bg-input)',
                padding: '5px',
                borderRadius: '10px',
                border: '1px solid var(--border-glass)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveMfaMode('push');
                  setError('');
                }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeMfaMode === 'push' ? 'var(--accent-cyan)' : 'transparent',
                  color: activeMfaMode === 'push' ? '#000' : 'var(--text-secondary)',
                  fontWeight: activeMfaMode === 'push' ? 700 : 500,
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <BellRing size={13} />
                <span>Push</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMfaMode('qr');
                  setError('');
                }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeMfaMode === 'qr' ? 'var(--accent-emerald)' : 'transparent',
                  color: activeMfaMode === 'qr' ? '#000' : 'var(--text-secondary)',
                  fontWeight: activeMfaMode === 'qr' ? 700 : 500,
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <QrCode size={13} />
                <span>QR Sign-in</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMfaMode('biometric');
                  setError('');
                }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeMfaMode === 'biometric' ? 'var(--accent-purple)' : 'transparent',
                  color: activeMfaMode === 'biometric' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: activeMfaMode === 'biometric' ? 700 : 500,
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Fingerprint size={13} />
                <span>Biometrics</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMfaMode('totp');
                  setError('');
                }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeMfaMode === 'totp' ? 'var(--accent-amber)' : 'transparent',
                  color: activeMfaMode === 'totp' ? '#000' : 'var(--text-secondary)',
                  fontWeight: activeMfaMode === 'totp' ? 700 : 500,
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <KeyRound size={13} />
                <span>TOTP</span>
              </button>
            </div>

            {/* MODE 1: MOBILE PUSH NOTIFICATION */}
            {activeMfaMode === 'push' && (
              <div
                className="animate-fade-in"
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                  border: '1px solid var(--border-glass)',
                  textAlign: 'center',
                }}
              >
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

                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                  Mobile Push Notification Dispatched
                </h3>
                <p style={{ margin: '0 0 18px 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  A sign-in request was sent to your <strong>Zoho OneAuth mobile app</strong>. Tap <strong>Approve</strong> on your phone (using Face ID or Fingerprint) to sign in.
                </p>

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
            )}

            {/* MODE 2: QR CODE SIGN-IN */}
            {activeMfaMode === 'qr' && (
              <div
                className="animate-fade-in"
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                  border: '1px solid var(--border-glass)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
                  <QrCode size={22} />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    Scan QR Code with Zoho OneAuth
                  </h3>
                </div>

                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                  Open the <strong>Zoho OneAuth</strong> app on your phone, tap the QR Scanner icon, and point your camera at this QR code.
                </p>

                {/* Scannable Dynamic Sign-in QR */}
                {mfaData?.mobileApprovalUrl && (
                  <div
                    style={{
                      padding: '12px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(
                        mfaData.mobileApprovalUrl
                      )}`}
                      alt="Zoho OneAuth QR Sign-In"
                      width={170}
                      height={170}
                      style={{ display: 'block' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Listening for mobile camera scan...</span>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateQrScan}
                  disabled={loading || isApproved}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '11px',
                    fontSize: '0.9rem',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{loading ? 'Verifying...' : 'Simulate Mobile QR Scan & Approve'}</span>
                </button>
              </div>
            )}

            {/* MODE 3: BIOMETRIC TOUCH (FINGERPRINT / FACE ID) */}
            {activeMfaMode === 'biometric' && (
              <div
                className="animate-fade-in"
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                  border: '1px solid var(--border-glass)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '2px solid var(--accent-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-purple)',
                  }}
                >
                  {biometricScanning ? (
                    <ScanFace size={34} className="animate-pulse" />
                  ) : (
                    <Fingerprint size={34} />
                  )}
                </div>

                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    Biometric Authentication
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '420px' }}>
                    Touch your fingerprint sensor or verify your Face ID to sign in securely with Zoho OneAuth biometrics.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Fingerprint size={14} color="var(--accent-cyan)" /> Touch ID / Fingerprint
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ScanFace size={14} color="var(--accent-purple)" /> Face ID
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleBiometricAuthenticate}
                  disabled={biometricScanning || isApproved}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '13px',
                    fontSize: '0.95rem',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    boxShadow: '0 4px 16px rgba(168, 85, 247, 0.35)',
                  }}
                >
                  {biometricScanning ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Fingerprint className="animate-spin" size={18} />
                      Scanning Biometrics...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Fingerprint size={18} />
                      Authenticate with Biometrics
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* MODE 4: TIME-BASED OTP (TOTP 6-DIGIT CODE) */}
            {activeMfaMode === 'totp' && (
              <div
                className="animate-fade-in"
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-amber)',
                      margin: '0 auto 10px auto',
                    }}
                  >
                    <KeyRound size={24} />
                  </div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    Time-based One-Time Password (TOTP)
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Enter the current 6-digit rolling code displayed in your Zoho OneAuth mobile app.
                  </p>
                </div>

                <form onSubmit={handleTotpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ position: 'relative' }}>
                    <KeyRound
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--accent-amber)',
                      }}
                    />
                    <input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      inputMode="numeric"
                      autoFocus
                      placeholder="123456"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="glass-input"
                      style={{
                        paddingLeft: '46px',
                        textAlign: 'center',
                        fontSize: '1.4rem',
                        letterSpacing: '0.35em',
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
                        padding: '4px 8px',
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
                      style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                    >
                      Verify Code
                    </button>
                  </div>
                </form>

                {/* Secret Key Display */}
                {mfaData?.secret && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '8px 12px',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <span>Key: {mfaData.secret}</span>
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
                )}
              </div>
            )}

            {/* Back to Step 1 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
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
                <span>Back to All Sign-In Options</span>
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
