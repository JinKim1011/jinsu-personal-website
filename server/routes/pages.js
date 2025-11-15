const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { ADMIN_PASSWORD } = require('../config/secrets');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).lean();
        res.render('pages/index', { title: 'Home — Jinsu Kim', posts });
    } catch (err) {
        console.error('Failed to render home page', err);
        res.status(500).send('Server Error');
    }
});

router.get('/blog', async (req, res) => {
    const posts = await Post.find({ category: "blog" }).sort({ createdAt: -1 }).lean();
    res.render('pages/blog', { title: 'Blog — Jinsu Kim', posts });
});

router.get('/work', async (req, res) => {
    const posts = await Post.find({ category: "work" }).sort({ createdAt: -1 }).lean();
    res.render('pages/work', { title: 'Work — Jinsu Kim', posts });
});

router.get('/posts/:slug', async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).lean();
    if (!post) return res.status(404).render('pages/post', { title: 'Not found', post: { title: 'Not found' } });
    // Optionally convert markdown body → HTML later
    res.render('pages/post', { title: `Post — ${post.title}`, post });
});

router.get('/edit', (req, res) => {
    res.render('pages/edit', { title: 'Edit Post — Jinsu Kim' });
});

router.get('/password', (req, res) => {
    res.render('pages/password', { title: 'Admin Login' });
});

router.post('/password', (req, res) => {
    const pw = req.body.password;
    if (pw === ADMIN_PASSWORD) {
        if (req.session) req.session.isAdmin = true;
        return res.redirect('/admin');
    }
    return res.status(401).render('pages/password', { error: 'Wrong password' });
});

module.exports = router;