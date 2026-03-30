// AI food quality check route
const express = require('express');
const router = express.Router();
const notImplemented = (req, res) => {
  res.status(501).json({ error: 'AI quality check is not implemented yet.' });
};

// POST /api/ai/check-quality — Upload image, get freshness analysis back
router.post('/check-quality', notImplemented);

module.exports = router;
