import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Fingerprint,
  ScanFace,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  BellRing,
} from 'lucide-react';
import { profileApi, authApi } from '../../services/api';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    titles: [],
    shortIntro: '',
    about: '',
    careerObjective: '',
    profileImage: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      portfolio: '',
      email: '',
      phone: '',
      whatsapp: '',
    },
  });

  const [titlesString, setTitlesString] = useState('');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [testPushStatus, setTestPushStatus] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileApi.get();
        if (res.data.success) {
          setProfile(res.data.data);
          setTitlesString((res.data.data.titles || []).join(', '));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileFeedback('');
      const updatedTitles = titlesString.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await profileApi.update({ ...profile, titles: updatedTitles });
      if (res.data.success) {
        setProfile(res.data.data);
        setProfileFeedback({ type: 'success', msg: 'Profile updated successfully!' });
      }
    } catch (err) {
      setProfileFeedback({ type: 'error', msg: err.response?.data?.message || 'Error updating profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await profileApi.uploadImage(formData);
      if (res.data.success) {
        setProfile((prev) => ({ ...prev, profileImage: res.data.imageUrl }));
        setProfileFeedback({ type: 'success', msg: 'Profile picture uploaded successfully!' });
      }
    } catch (err) {
      setProfileFeedback({ type: 'error', msg: 'Failed to upload image' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordFeedback({ type: 'error', msg: 'New passwords do not match' });
      return;
    }

    try {
      setSavingPassword(true);
      setPasswordFeedback('');
      const res = await authApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.data.success) {
        setPasswordFeedback({ type: 'success', msg: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordFeedback({ type: 'error', msg: err.response?.data?.message || 'Password update failed' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Profile & Account Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Update your public portfolio biography, headline titles, social handles, and security credentials.
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={20} color="var(--accent-cyan)" />
          <span>Public Profile Information</span>
        </h2>

        {profileFeedback && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: profileFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: profileFeedback.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
              marginBottom: '20px',
              fontSize: '0.88rem',
            }}
          >
            {profileFeedback.msg}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Avatar Upload */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '10px' }}>
            <img
              src={profile.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
              alt="Avatar"
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-cyan)' }}
            />
            <div>
              <label className="btn-secondary" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                <Upload size={15} />
                <span>{uploadingImage ? 'Uploading...' : 'Upload New Photo'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Supported: JPG, PNG, WEBP (Max 5MB)
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Titles / Roles (Comma Separated for Typing Animation)
              </label>
              <input
                type="text"
                value={titlesString}
                onChange={(e) => setTitlesString(e.target.value)}
                className="glass-input"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Short Hero Intro
            </label>
            <input
              type="text"
              value={profile.shortIntro}
              onChange={(e) => setProfile({ ...profile, shortIntro: e.target.value })}
              className="glass-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Full Biography (About Me)
            </label>
            <textarea
              rows="4"
              value={profile.about}
              onChange={(e) => setProfile({ ...profile, about: e.target.value })}
              className="glass-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Career Objective
            </label>
            <textarea
              rows="3"
              value={profile.careerObjective}
              onChange={(e) => setProfile({ ...profile, careerObjective: e.target.value })}
              className="glass-input"
            />
          </div>

          {/* Social Links Subgrid */}
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 0 0' }}>
            Social Media & Contact Links
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>GitHub URL</label>
              <input
                type="text"
                value={profile.socialLinks?.github || ''}
                onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })}
                className="glass-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>LinkedIn URL</label>
              <input
                type="text"
                value={profile.socialLinks?.linkedin || ''}
                onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })}
                className="glass-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Twitter / X URL</label>
              <input
                type="text"
                value={profile.socialLinks?.twitter || ''}
                onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, twitter: e.target.value } })}
                className="glass-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Public Email</label>
              <input
                type="email"
                value={profile.socialLinks?.email || ''}
                onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, email: e.target.value } })}
                className="glass-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="btn-primary"
            style={{ alignSelf: 'flex-start', padding: '10px 24px', marginTop: '10px' }}
          >
            <Save size={16} />
            <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

      {/* Security: Change Password */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lock size={20} color="var(--accent-purple)" />
          <span>Security & Change Password</span>
        </h2>

        {passwordFeedback && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: passwordFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: passwordFeedback.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
              marginBottom: '20px',
              fontSize: '0.88rem',
            }}
          >
            {passwordFeedback.msg}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="glass-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="glass-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="btn-primary"
            style={{ alignSelf: 'flex-start', padding: '10px 24px', marginTop: '10px' }}
          >
            <Lock size={16} />
            <span>{savingPassword ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Zoho OneAuth 2FA Mobile App Setup & Connection */}
      <div className="glass-panel" style={{ padding: '32px', marginTop: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Smartphone size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Zoho OneAuth Mobile App Connection
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Connect your iOS or Android phone to receive push notifications and verify with Face ID / Fingerprint.
              </p>
            </div>
          </div>

          <span
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--accent-emerald)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} />
            Active & Protected
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
          {/* Scannable QR Code */}
          <div
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-glass)',
              borderRadius: '14px',
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Scan with Zoho OneAuth Mobile App
            </span>

            <div
              style={{
                padding: '12px',
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  'otpauth://totp/Hariharan%20Portfolio:admin@hariharan.dev?secret=JBSWY3DPEHPK3PXP&issuer=Hariharan%20Portfolio&algorithm=SHA1&digits=6&period=30'
                )}`}
                alt="Zoho OneAuth Setup QR"
                width={180}
                height={180}
                style={{ display: 'block' }}
              />
            </div>

            {/* Secret Key with 1-Click Copy */}
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textAlign: 'left' }}>
                Manual Secret Key:
              </div>
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
                <span>JBSWY3DPEHPK3PXP</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('JBSWY3DPEHPK3PXP');
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
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

          {/* Connection Steps & Capabilities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              How to Connect in 3 Simple Steps:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-cyan)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
                  1
                </span>
                <div>
                  <strong>Download Zoho OneAuth</strong> on your smartphone from Apple App Store or Google Play.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-cyan)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
                  2
                </span>
                <div>
                  Tap <strong>+ (Add Account)</strong> in Zoho OneAuth and scan the QR code displayed on the left (or enter the secret key manually).
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-cyan)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
                  3
                </span>
                <div>
                  Enable <strong>Face ID / Fingerprint unlock</strong> inside Zoho OneAuth. You can now approve sign-in notifications with one touch or view live 6-digit TOTP codes anytime.
                </div>
              </div>
            </div>

            {/* Supported Biometric Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                <Fingerprint size={16} /> Fingerprint Unlock
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.2)', fontSize: '0.8rem', color: 'var(--accent-purple)' }}>
                <ScanFace size={16} /> Face ID Unlock
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '0.8rem', color: 'var(--accent-amber)' }}>
                <BellRing size={16} /> Push Notifications
              </span>
            </div>

            {/* Test Push Button */}
            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setTestPushStatus('sending');
                    const res = await authApi.initiateZohoPush({ email: 'admin@hariharan.dev' });
                    if (res.data.success) {
                      setTestPushStatus('success');
                      setTimeout(() => setTestPushStatus(''), 4000);
                    }
                  } catch (err) {
                    setTestPushStatus('error');
                    setTimeout(() => setTestPushStatus(''), 4000);
                  }
                }}
                className="btn-secondary"
                style={{ padding: '10px 18px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <BellRing size={16} />
                <span>
                  {testPushStatus === 'sending'
                    ? 'Dispatching Push...'
                    : testPushStatus === 'success'
                    ? '✓ Push Notification Dispatched to Mobile!'
                    : testPushStatus === 'error'
                    ? 'Error Sending Push'
                    : 'Send Test Push Notification to Mobile'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
