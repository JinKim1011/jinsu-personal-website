const { ADMIN_PASSWORD } = require('../config/secrets');

module.exports = function passwordGate(req, res, next) {
    try {
        if (req.session && req.session.isAdmin) return next();

        const pw = req.headers['x-admin-password'] || req.body && req.body.password;
        if (pw === ADMIN_PASSWORD) {
            if (req.session) req.session.isAdmin = true;
            return next();
        }

        return res.status(401).json({ error: 'Unauthorized' });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
