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

    const renderMarkdown = (text = '') => {
        const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
        const lines = String(text).split('\n').map(l => {
            const raw = String(l || '');
            const trimmed = raw.trim();
            // skip empty lines (avoid emitting empty <p> tags)
            if (!trimmed) return '';

            if (raw.startsWith('# ')) return '<h1>' + esc(raw.slice(2)) + '</h1>';
            if (raw.startsWith('## ')) return '<h2>' + esc(raw.slice(3)) + '</h2>';
            if (raw.startsWith('### ')) return '<h3>' + esc(raw.slice(4)) + '</h3>';
            const listMatch = raw.match(/^\s*-\s+(.*)/);
            if (listMatch) return '<li>' + esc(listMatch[1]) + '</li>';
            const mdImage = raw.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^\"]+)")?\)/);
            if (mdImage) {
                const [, alt, url, title] = mdImage;
                return `<img style="max-width:100%" src="${esc(url)}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ''}/>`;
            }
            if (/^https?:\/\/.*\.(png|jpg|jpeg|gif|webp)(?:[?#].*)?$/i.test(trimmed)) return `<img style="max-width:100%" src="${esc(trimmed)}"/>`;
            return '<p>' + esc(raw) + '</p>';
        }).join('');
        return lines.replace(/(?:<li>[\s\S]*?<\/li>)+/g, m => '<ul>' + m + '</ul>');
    };

    const postHtml = renderMarkdown(post.content);
    res.render('pages/post', { title: `Post — ${post.title}`, post, postHtml });
});

router.get('/admin', async (req, res) => {
    try {
        if (!req.session || !req.session.isAdmin) return res.redirect('/password');
        const posts = await Post.find().sort({ createdAt: -1 }).lean();
        res.render('pages/admin', { title: 'Admin', posts });
    } catch (err) {
        console.error('Failed to render admin page', err);
        res.status(500).send('Server Error');
    }
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