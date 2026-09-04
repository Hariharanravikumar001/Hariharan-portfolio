const crypto = require('crypto');

// In-memory store for active MFA push approval sessions (TTL: 5 minutes)
const sessions = new Map();

/**
 * Creates a new MFA push approval session
 * @param {Object} data
 * @returns {Object} Session object
 */
const createSession = ({ userId, email, role = 'admin', userAgent = '', ip = '' }) => {
  const sessionId = 'zoho_mfa_' + crypto.randomBytes(16).toString('hex');
  const now = Date.now();
  const session = {
    sessionId,
    userId,
    email,
    role,
    status: 'PENDING', // 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
    createdAt: now,
    expiresAt: now + 5 * 60 * 1000, // 5 minutes
    userAgent,
    ip: ip || '127.0.0.1',
    deviceType: /mobile/i.test(userAgent) ? 'Mobile Device' : 'Desktop Browser',
    approvedAt: null,
    biometricUsed: null,
  };

  sessions.set(sessionId, session);
  return session;
};

/**
 * Gets a session by ID and handles expiry
 * @param {string} sessionId
 * @returns {Object|null}
 */
const getSession = (sessionId) => {
  if (!sessionId) return null;
  const session = sessions.get(sessionId);
  if (!session) return null;

  if (Date.now() > session.expiresAt && session.status === 'PENDING') {
    session.status = 'EXPIRED';
  }

  return session;
};

/**
 * Approves an MFA session (from mobile or simulation)
 * @param {string} sessionId
 * @param {Object} meta
 * @returns {boolean}
 */
const approveSession = (sessionId, meta = {}) => {
  const session = getSession(sessionId);
  if (!session || session.status !== 'PENDING') {
    return false;
  }

  session.status = 'APPROVED';
  session.approvedAt = Date.now();
  session.biometricUsed = meta.biometricUsed || 'Face ID / Fingerprint (Zoho OneAuth)';
  return true;
};

/**
 * Rejects an MFA session
 * @param {string} sessionId
 * @returns {boolean}
 */
const rejectSession = (sessionId) => {
  const session = getSession(sessionId);
  if (!session || session.status !== 'PENDING') {
    return false;
  }

  session.status = 'REJECTED';
  return true;
};

// Periodically clean up expired sessions
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now > session.expiresAt + 60000) {
      sessions.delete(id);
    }
  }
}, 60000);
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

module.exports = {
  createSession,
  getSession,
  approveSession,
  rejectSession,
};
