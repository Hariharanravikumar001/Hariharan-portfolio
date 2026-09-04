const crypto = require('crypto');
const Visitor = require('../models/Visitor');

const getDeviceType = (ua = '') => {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
};

const getBrowser = (ua = '') => {
  if (/edg/i.test(ua)) return 'Edge';
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua)) return 'Safari';
  if (/opera|opr/i.test(ua)) return 'Opera';
  return 'Other';
};

const getOS = (ua = '') => {
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os x/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  if (/android/i.test(ua)) return 'Android';
  if (/ios|iphone|ipad/i.test(ua)) return 'iOS';
  return 'Other';
};

const visitorTracker = async (req, res, next) => {
  // Skip non-GET, static assets, health checks, analytics, auth, or admin sessions
  if (
    req.method !== 'GET' ||
    req.path.startsWith('/uploads') ||
    req.path === '/api/health' ||
    req.path.startsWith('/api/analytics') ||
    req.path.startsWith('/api/auth') ||
    Boolean(req.headers.authorization)
  ) {
    return next();
  }

  const rawIp =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex').substring(0, 16);
  const userAgent = req.headers['user-agent'] || '';
  const device = getDeviceType(userAgent);
  const browser = getBrowser(userAgent);
  const os = getOS(userAgent);
  const referrer = req.headers['referer'] || req.headers['referrer'] || '';
  const pageVisited = req.originalUrl || req.path;

  // Asynchronously record visitor without blocking request response
  setImmediate(async () => {
    try {
      await Visitor.create({
        ipHash,
        userAgent: userAgent.substring(0, 300),
        device,
        browser,
        os,
        country: 'India', // Fallback default or geoip
        city: 'Chennai',
        pageVisited,
        referrer,
      });
    } catch (err) {
      // Quietly ignore analytics recording error in background
    }
  });

  next();
};

module.exports = visitorTracker;
