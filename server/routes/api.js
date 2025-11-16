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

        // handle form submission redirect
        const isForm = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded');
        if (isForm) {
            return res.redirect(`/posts/${encodeURIComponent(post.slug)}`);
        }

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

router.get('/posts/:slug/delete', async (req, res) => {
    try {
        await Post.findOneAndDelete({ slug: req.params.slug }).exec();

        // redirect to admin page after deletion
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(400).send('Error: No post was deleted.');
    }
});

router.get('/health', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;