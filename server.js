require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './server/views/pages');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

// serve static files
app.use(express.static(path.join(__dirname, 'client'), { index: false }));
const { ADMIN_PASSWORD } = require('./server/config/secrets');

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/work', (req, res) => {
    res.render('work');
});
app.get('/blog', (req, res) => {
    res.render('blog');
});
app.get('/admin', (req, res) => {
    if (!req.session || !req.session.isAdmin) return res.redirect('/password');
    res.render('admin');
});
app.get('/edit', (req, res) => {
    res.render('edit');
});
app.get('/password', (req, res) => {
    res.render('password');
});
app.post('/password', (req, res) => {
    const pw = req.body.password;
    if (pw === ADMIN_PASSWORD) {
        if (req.session) req.session.isAdmin = true;
        return res.redirect('/admin');
    }
    return res.status(401).render('password', { error: 'Wrong password' });
});

const adminRoutes = require('./server/routes/admin');
app.use('/api/admin', adminRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
