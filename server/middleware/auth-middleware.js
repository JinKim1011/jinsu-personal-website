const { ADMIN_PASSWORD } = require('../config/secrets');

// middleware to protect routes with admin password
module.exports = function passwordGate(req, res, next) {
    const pw = req.headers['x-admin-password'] || req.body.password;

    if (pw === ADMIN_PASSWORD) return next();
    return res.status(401).json({ error: 'Unauthorized' });
};
