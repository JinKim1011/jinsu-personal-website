require('dotenv').config();

if (!process.env.ADMIN_PASSWORD) {
    throw new Error('Missing required environment variable: ADMIN_PASSWORD');
}

module.exports = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
};