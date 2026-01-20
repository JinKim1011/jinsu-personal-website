const mongoose = require('mongoose');

function _attachListeners(conn) {
    conn.on('connected', () => console.log('💽 MongoDB connected'));
    conn.on('error', (err) => console.error('🔌 MongoDB error:', err));
    conn.on('disconnected', () => console.warn('⚠  MongoDB disconnected'));
}

async function connectToDatabase(uri) {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    _attachListeners(mongoose.connection);

    try {
        await mongoose.connect(uri, options);
        console.log('💽 Database connected');
        return mongoose.connection;
    } catch (err) {
        console.error('MongoDB connection error:', err && err.message ? err.message : err);
        throw err;
    }
}

module.exports = { connectToDatabase };