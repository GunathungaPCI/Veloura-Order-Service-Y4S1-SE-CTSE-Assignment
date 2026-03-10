/**
 * requireRoles — authorization guard for role-based access control.
 * Structure mirrors the auth service's roleMiddleware.js.
 * Must be used after the authenticate middleware.
 *
 * Usage:
 *   router.get('/admin-route', authenticate, requireRoles('admin'), handler)
 *   router.get('/user-route',  authenticate, requireRoles('user'),  handler)
 */
const requireRoles = (...roles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };
};

module.exports = { requireRoles };
