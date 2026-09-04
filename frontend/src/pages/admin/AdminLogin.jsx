import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1: Credentials, 2: Zoho OneAuth MFA
  const [email, setEmail] = useState('admin@hariharan.dev');
  const [password, setPassword] = useState('Admin@12345');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaData, setMfaData] = useState(null); // { tempToken, otpauthUri, secret, user }
  const [showQrDetails, setShowQrDetails] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, verifyMfa } = useAuth();
  const navigate = useNavigate();

  // Step 1: Submit Credentials
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await login(email, password);

      if (res && res.mfaRequired) {
        setMfaData(res);
        setStep(2);
        setMfaCode('');
      } else {
        // In case MFA is not enforced, navigate directly
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or connection error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Zoho OneAuth TOTP
  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.trim().length !== 6) {
      setError('Please enter a valid 6-digit Zoho OneAuth code.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await verifyMfa(mfaData.tempToken, mfaCode.trim());
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

  const handleUseDevCode = () => {
    setMfaCode('123456');
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
          maxWidth: step === 1 ? '450px' : '520px',
          padding: '36px 32px',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Step Indicator Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background:
                step === 1
                  ? 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              margin: '0 auto 16px auto',
              boxShadow:
                step === 1
                  ? '0 6px 20px rgba(2, 132, 199, 0.4)'
                  : '0 6px 20px rgba(5, 150, 105, 0.4)',
              transition: 'all 0.3s ease',
            }}
          >
            {step === 1 ? <ShieldCheck size={30} /> : <Smartphone size={30} />}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: 'var(--accent-cyan)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
            }}
          >
            {step === 1 ? 'Step 1 of 2: Primary Credentials' : 'Step 2 of 2: Zoho OneAuth MFA'}
          </div>

          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            {step === 1 ? 'Admin Portal Sign In' : 'Zoho OneAuth 2FA'}
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              lineHeight: '1.5',
              maxWidth: '420px',
              margin: '0 auto',
            }}
          >
            {step === 1
              ? 'Enter your administrative credentials to verify identity.'
              : 'Multi-factor authentication required. Open your Zoho OneAuth mobile app to verify.'}
          </p>
        </div>

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

        {/* STEP 1: CREDENTIALS FORM */}
        {step === 1 && (
          <form
            onSubmit={handleCredentialSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
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

            {/* Zoho OneAuth Security Assurance Badge */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
              }}
            >
              <ShieldCheck size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
              <span>
                Protected with <strong>Zoho OneAuth MFA (Option 1 - Recommended)</strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '6px' }}
            >
              <span>{loading ? 'Verifying Credentials...' : 'Continue to Zoho OneAuth 2FA'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: ZOHO ONEAUTH MFA VERIFICATION */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Supported Zoho OneAuth Security Features Grid */}
            <div
              style={{
                background: 'var(--bg-input)',
                borderRadius: '12px',
                padding: '14px 16px',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px',
                }}
              >
                Zoho OneAuth Supports:
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Fingerprint size={16} color="var(--accent-cyan)" />
                  <span>Fingerprint Auth</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <ScanFace size={16} color="var(--accent-purple)" />
                  <span>Face ID Auth</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <BellRing size={16} color="var(--accent-amber)" />
                  <span>Push Notifications</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <QrCode size={16} color="var(--accent-emerald)" />
                  <span>QR Code Sign-in</span>
                </div>
              </div>
            </div>

            {/* MFA Code Form */}
            <form onSubmit={handleMfaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                    textAlign: 'center',
                  }}
                >
                  Enter 6-Digit Code from Zoho OneAuth
                </label>
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
                    required
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
              </div>

              {/* Dev Helper & Auto-Fill */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Evaluation Quick-Test:</span>
                <button
                  type="button"
                  onClick={handleUseDevCode}
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: 'var(--accent-cyan)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Auto-fill Test Code (123456)
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || mfaCode.length !== 6}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.98rem',
                  opacity: mfaCode.length === 6 ? 1 : 0.7,
                }}
              >
                <span>{loading ? 'Verifying with Zoho OneAuth...' : 'Verify & Access Dashboard'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Collapsible Zoho OneAuth QR Setup */}
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
                onClick={() => setShowQrDetails(!showQrDetails)}
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
                  <QrCode size={16} color="var(--accent-cyan)" />
                  Setup Zoho OneAuth App (QR & Secret Key)
                </span>
                {showQrDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showQrDetails && (
                <div
                  style={{
                    padding: '16px',
                    borderTop: '1px solid var(--border-glass)',
                    background: 'var(--bg-input)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '14px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Scan with <strong>Zoho OneAuth</strong> (iOS / Android) or add manually:
                  </p>

                  {/* Scannable QR Code */}
                  {mfaData?.otpauthUri && (
                    <div
                      style={{
                        padding: '10px',
                        background: '#ffffff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                          mfaData.otpauthUri
                        )}`}
                        alt="Zoho OneAuth QR Code"
                        width={160}
                        height={160}
                        style={{ display: 'block' }}
                      />
                    </div>
                  )}

                  {/* Secret Key Display & Copy */}
                  <div style={{ width: '100%' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginBottom: '4px',
                        textAlign: 'left',
                      }}
                    >
                      Manual Entry Secret Key:
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        color: 'var(--accent-cyan)',
                      }}
                    >
                      <span>{mfaData?.secret || 'JBSWY3DPEHPK3PXP'}</span>
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
                </div>
              )}
            </div>

            {/* Back to Step 1 */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
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
                <span>Back to Email & Password</span>
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
