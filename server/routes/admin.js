const express = require('express');
const router = express.Router();
const passwordGate = require('../middleware/auth-middleware');

router.post('/content', passwordGate, (req, res) => {
    // placeholder for create/update content
    res.json({ ok: true });
});

module.exports = router;
