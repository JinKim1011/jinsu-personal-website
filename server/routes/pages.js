const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { ADMIN_PASSWORD } = require('../config/secrets');
const passwordGate = require('../middleware/auth-middleware');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: 1 }).lean();
        res.render('pages/index', { title: 'Home — Jinsu Kim', posts });
    } catch (err) {
        console.error('Failed to render home page', err);
        res.status(500).send('Server Error');
    }
});

router.get('/blog', async (req, res) => {
    const posts = await Post.find({ category: "blog" }).sort({ createdAt: 1 }).lean();
    res.render('pages/blog', { title: 'Blog — Jinsu Kim', posts });
});

router.get('/work', async (req, res) => {
    const posts = await Post.find({ category: "work" }).sort({ createdAt: 1 }).lean();
    res.render('pages/work', { title: 'Work — Jinsu Kim', posts });
});

router.get('/posts/new', passwordGate, (req, res) => {
    res.render('pages/edit', { title: 'New Post — Jinsu Kim', mode: 'create', post: null });
});

router.get('/posts/:slug/edit', passwordGate, async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).lean();
        if (!post) throw new Error('Post not found');
        res.render('pages/edit', { title: `Edit Post — ${post.title}`, mode: 'edit', post });
    } catch (err) {
        console.error(err);
        res.status(404).send("Couldn't find the post to edit.");
    }
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
            const ytMatch = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})(?:[^\s]*)$/i);
            if (ytMatch) {
                const id = ytMatch[1];
                return `<iframe src="https://www.youtube.com/embed/${esc(id)}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
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
        const posts = await Post.find().sort({ createdAt: 1 }).lean();
        res.render('pages/admin', { title: 'Admin', posts });
    } catch (err) {
        console.error('Failed to render admin page', err);
        res.status(500).send('Server Error');
    }
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