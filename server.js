require('dotenv').config(); // load environment variables

// core
const express = require('express');
const session = require('express-session');
const path = require('path');

// routers / app-specific modules
const pagesRouter = require('./server/routes/pages');
const adminRoutes = require('./server/routes/admin');
const apiRouter = require('./server/routes/api');
const errorHandler = require('./server/middleware/error-handeler');

// database
const { connectToDatabase } = require('./server/config/db');

const app = express();

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}));

// API routes (mount admin API)
app.use('/api/admin', adminRoutes);

// view engine
app.set('view engine', 'ejs');
app.set('views', './server/views');

// static assets (client/) served at web root
app.use(express.static(path.join(__dirname, 'client'), { index: false }));

// mount api router (additional API endpoints)
app.use('/api', apiRouter);

// admin pages
app.get('/admin', (req, res) => {
    if (!req.session || !req.session.isAdmin) return res.redirect('/password');
    res.render('admin');
});
app.get('/password', (req, res) => res.render('password')); // Render password input page
// Handle password submission
app.post('/password', (req, res) => {
    const pw = req.body.password;
    if (pw === ADMIN_PASSWORD) {
        if (req.session) req.session.isAdmin = true;
        return res.redirect('/admin');
    }
    return res.status(401).render('password', { error: 'Wrong password' });
});

// health route
app.get('/health', (req, res) => res.json({ ok: true }));

// error handlers
app.use(errorHandler.notFound);
app.use(errorHandler.errorHandler);

const port = process.env.PORT || 3000;
(async () => {
    await connectToDatabase(process.env.MONGODB_URI); // e.g., mongodb://127.0.0.1:27017/portfolio
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})();

module.exports = app;