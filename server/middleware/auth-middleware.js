const { ADMIN_PASSWORD } = require('../config/secrets');

module.exports = function passwordGate(request, response, next) {
    try {
        if (request.session && request.session.isAdmin) return next();

        const password = request.headers['x-admin-password'] || request.body && request.body.password;
        if (password === ADMIN_PASSWORD) {
            if (request.session)
                request.session.isAdmin = true;
            return next();
        }

        return response.status(401).json({ error: 'Unauthorized' });
    } catch (error) {
        return response.status(500).json({ error: 'Server error' });
    }
};
