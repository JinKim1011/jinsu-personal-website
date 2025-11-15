const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// create a new post from json body
router.post('/posts', async (req, res) => {
    try {
        const post = new Post({
            slug: req.body.slug,
            category: req.body.category,
            title: req.body.title,
            summary: req.body.summary,
            date: req.body.date,
            content: req.body.content,
            published: req.body.published
        });
        await post.save();
        res.status(201).json({ ok: true, post });
    } catch (err) {
        res.status(400).json({ error: 'Could not create post', details: err.message });
    }
});

router.get('/posts', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json(posts);
});

router.get('/posts/:slug', async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
});

router.get('/health', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;