// Food listing routes
const express = require('express');
const router = express.Router();
// const foodController = require('../controllers/food.controller');
// const { isAuthenticated } = require('../middleware/auth.middleware');
// const upload = require('../config/multer.config');

// GET /api/food — Get all available food listings
router.get('/', /* foodController.getAllFood */);

// GET /api/food/nearby — Get food near user's location (?lat=&lng=&radius=)
router.get('/nearby', /* foodController.getNearbyFood */);

// GET /api/food/:id — Get single food listing
router.get('/:id', /* foodController.getFoodById */);

// POST /api/food — Create new food listing (with image upload)
router.post('/', /* isAuthenticated, upload.single('image'), foodController.createFood */);

// PUT /api/food/:id — Update food listing
router.put('/:id', /* isAuthenticated, foodController.updateFood */);

// DELETE /api/food/:id — Delete food listing
router.delete('/:id', /* isAuthenticated, foodController.deleteFood */);

module.exports = router;
