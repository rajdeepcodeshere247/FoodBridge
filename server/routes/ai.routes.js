// AI food quality check route
const express = require('express');
const router = express.Router();
// const aiController = require('../controllers/ai.controller');
// const upload = require('../config/multer.config');

// POST /api/ai/check-quality — Upload image, get freshness analysis back
router.post('/check-quality', /* upload.single('image'), aiController.checkFoodQuality */);

module.exports = router;
