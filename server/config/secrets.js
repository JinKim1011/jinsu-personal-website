require('dotenv').config();

// Load admin password from environment variables or use a default
module.exports = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123'
};