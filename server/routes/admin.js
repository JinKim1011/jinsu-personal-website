const express = require('express');
const router = express.Router();
const passwordGate = require('../middleware/auth-middleware');

router.post('/content', passwordGate, (response) => {
    // placeholder for create/update content
    response.json({ ok: true });
});

// Create
router.post('/posts', passwordGate, async (req, res) => { });

// Update
router.post('/posts/:slug', passwordGate, async (req, res) => { });

// Delete (link-based GET)
router.get('/posts/:slug/delete', passwordGate, async (req, res) => { });

module.exports = router;
