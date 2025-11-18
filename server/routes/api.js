const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const passwordGate = require('../middleware/auth-middleware');

// create a new post from json body
router.post('/posts', passwordGate, async (req, res) => {
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
    const posts = await Post.find().sort({ createdAt: 1 }).lean();
    res.json(posts);
});

router.get('/posts/:slug', async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
});

router.get('/posts/:slug/delete', passwordGate, async (req, res) => {
    try {
        await Post.findOneAndDelete({ slug: req.params.slug }).exec();

        // redirect to admin page after deletion
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(400).send('Error: No post was deleted.');
    }
});

// update an existing post (form submit or JSON)
router.post('/posts/:slug', passwordGate, async (req, res) => {
    try {
        const data = {
            slug: req.body.slug,
            category: req.body.category,
            title: req.body.title,
            summary: req.body.summary,
            date: req.body.date,
            content: req.body.content,
            published: req.body.published
        };

        const updated = await Post.findOneAndUpdate({ slug: req.params.slug }, data, { new: true, runValidators: true }).exec();
        if (!updated) return res.status(404).json({ error: 'Not found' });

        const isForm = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded');
        if (isForm) return res.redirect(`/posts/${encodeURIComponent(updated.slug)}`);

        res.json({ ok: true, post: updated });
    } catch (err) {
        console.error('Failed to update post', err);
        res.status(400).json({ error: 'Could not update post', details: err.message });
    }
});

// delete via POST (form) to match the edit form's `formaction`+`formmethod`
router.post('/posts/:slug/delete', passwordGate, async (req, res) => {
    try {
        await Post.findOneAndDelete({ slug: req.params.slug }).exec();
        const isForm = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded');
        if (isForm) return res.redirect('/admin');
        res.json({ ok: true });
    } catch (err) {
        console.error('Failed to delete post', err);
        res.status(400).json({ error: 'Could not delete post', details: err.message });
    }
});

const { healthHandler } = require('../middleware/health');

router.get('/health', healthHandler);

module.exports = router;