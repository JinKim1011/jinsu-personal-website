require('dotenv').config(); // load environment variables

const express = require('express');
const session = require('express-session');
const path = require('path');

const adminRoutes = require('./server/routes/admin');
const { ADMIN_PASSWORD } = require('./server/config/secrets');

const { connectToDatabase } = require('./server/config/db');
const Post = require('./server/models/Post');

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

// API routes
app.use('/api/admin', adminRoutes);

// set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', './server/views/pages');

// serve static files
app.use(express.static(path.join(__dirname, 'client'), { index: false }));

const pages = [
    { path: '/', view: 'index' },
    { path: '/work', view: 'work' },
    { path: '/blog', view: 'blog' },
    { path: '/edit', view: 'edit' }
];
pages.forEach(p => {
    app.get(p.path, (req, res) => res.render(p.view));
});

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

// json api routes for posts
app.get('/api/posts', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json(posts);
});
app.post('/api/posts', async (req, res) => {
    try {
        const { title, slug, content, tags = [], published = false } = req.body;
        const created = await Post.create({ title, slug, content, tags, published });
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// API routes
app.use('/api', require('./server/routes/api'));

const port = process.env.PORT || 3000;
(async () => {
    await connectToDatabase(process.env.MONGODB_URI); // e.g., mongodb://127.0.0.1:27017/portfolio
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})();

module.exports = app;