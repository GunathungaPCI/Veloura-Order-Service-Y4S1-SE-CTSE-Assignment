const jwt = require('jsonwebtoken');

/**
 * Resolves signing/verification keys from environment variables.
 * Mirrors the same logic used by the auth service (tokenService.js).
 * Prefers RS256 asymmetric keys; falls back to HS256 with JWT_SECRET.
 */
const resolveJwtConfig = () => {
  const privateKey = (process.env.JWT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const publicKey  = (process.env.JWT_PUBLIC_KEY  || '').replace(/\\n/g, '\n');

  if (privateKey && publicKey) {
    return { algorithm: 'RS256', privateKey, publicKey };
  }

  const secret = process.env.JWT_SECRET;
  if (secret) {
    return { algorithm: 'HS256', secret };
  }

  throw new Error('JWT configuration missing. Set JWT_SECRET or RSA keys.');
};

/**
 * Extracts the Bearer token from an Authorization header value.
 * Returns null if the header is missing or not a Bearer token.
 */
const getBearerToken = (authHeader) => {
  if (!authHeader) return null;
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
};

/**
 * Verifies an access token and returns the decoded payload.
 * Throws if the token is invalid or expired.
 */
const verifyAccessToken = (token) => {
  const { algorithm, publicKey, secret } = resolveJwtConfig();
  const verificationKey = algorithm === 'RS256' ? publicKey : secret;
  return jwt.verify(token, verificationKey, { algorithms: [algorithm] });
};

module.exports = { getBearerToken, verifyAccessToken };
