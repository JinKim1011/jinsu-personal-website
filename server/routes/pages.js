const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

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

module.exports = router;