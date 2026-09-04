const crypto = require('crypto');

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encodes a buffer to a Base32 string
 * @param {Buffer} buffer
 * @returns {string}
 */
const base32Encode = (buffer) => {
  let bits = '';
  for (let i = 0; i < buffer.length; i++) {
    bits += buffer[i].toString(2).padStart(8, '0');
  }
  let base32 = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5).padEnd(5, '0');
    base32 += BASE32_ALPHABET[parseInt(chunk, 2)];
  }
  return base32;
};

/**
 * Decodes a Base32 string to a Buffer
 * @param {string} base32
 * @returns {Buffer}
 */
const base32Decode = (base32) => {
  const cleaned = base32.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = '';
  for (let i = 0; i < cleaned.length; i++) {
    const val = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (val === -1) {
      throw new Error(`Invalid Base32 character: ${cleaned[i]}`);
    }
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
};

/**
 * Generates a random Base32 secret key for TOTP
 * @param {number} length
 * @returns {string}
 */
const generateSecret = (length = 20) => {
  const randomBytes = crypto.randomBytes(length);
  return base32Encode(randomBytes);
};

/**
 * Generates an RFC 6238 6-digit TOTP code for a given timestamp
 * @param {string} secret Base32 encoded secret
 * @param {number} time Unix epoch time in seconds
 * @param {number} period Time step in seconds (default: 30)
 * @returns {string} 6-digit TOTP code
 */
const generateTotp = (secret, time = Math.floor(Date.now() / 1000), period = 30) => {
  const key = base32Decode(secret);
  const counter = Math.floor(time / period);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const codeInt =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (codeInt % 1000000).toString().padStart(6, '0');
};

/**
 * Verifies an entered TOTP code against the secret key with a window tolerance
 * @param {string} token Entered 6-digit code
 * @param {string} secret Base32 secret
 * @param {number} window Steps before and after to accept (default: 1 step = 30s drift)
 * @returns {boolean}
 */
const verifyTotp = (token, secret, window = 1) => {
  if (!token || !secret) return false;
  const cleanedToken = String(token).trim().replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanedToken)) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  const period = 30;

  for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
    const time = currentTime + errorWindow * period;
    const expectedToken = generateTotp(secret, time, period);
    if (crypto.timingSafeEqual(Buffer.from(cleanedToken), Buffer.from(expectedToken))) {
      return true;
    }
  }

  return false;
};

/**
 * Creates standard otpauth:// URI for Zoho OneAuth and other authenticator apps
 * @param {Object} options
 * @param {string} options.secret
 * @param {string} options.email
 * @param {string} options.issuer
 * @returns {string}
 */
const getOtpAuthUri = ({ secret, email, issuer = 'Hariharan Portfolio' }) => {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
};

module.exports = {
  base32Encode,
  base32Decode,
  generateSecret,
  generateTotp,
  verifyTotp,
  getOtpAuthUri,
};
