const crypto = require('crypto');

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `${ITERATIONS}:${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  if (!storedHash || typeof storedHash !== 'string') return false;

  const [storedIterations, salt, originalHash] = storedHash.split(':');
  if (!storedIterations || !salt || !originalHash) return false;

  const hash = crypto
    .pbkdf2Sync(password, salt, Number(storedIterations), KEY_LENGTH, DIGEST)
    .toString('hex');

  const originalBuffer = Buffer.from(originalHash, 'hex');
  const hashBuffer = Buffer.from(hash, 'hex');

  if (originalBuffer.length !== hashBuffer.length) return false;
  return crypto.timingSafeEqual(originalBuffer, hashBuffer);
};

module.exports = { hashPassword, verifyPassword };
