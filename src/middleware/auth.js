const { getBearerToken, verifyAccessToken } = require('../utils/jwt');

/**
 * authenticate — verifies the JWT access token on every protected route.
 * Structure mirrors the auth service's authMiddleware.js.
 * Sets req.user = { id, roles } on success.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.header('authorization') || '';
  const token = getBearerToken(authHeader);

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id:    payload.userId,
      roles: payload.roles || [],
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
