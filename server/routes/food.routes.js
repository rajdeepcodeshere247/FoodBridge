// Food listing routes
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');
const upload = require('../config/multer.config');
const asyncHandler = require('../middleware/async.middleware');
// const { isAuthenticated } = require('../middleware/auth.middleware');

// GET /api/food — Get all available food listings
router.get('/', asyncHandler(foodController.getAllFood));

// GET /api/food/nearby — Get food near user's location (?lat=&lng=&radius=)
router.get('/nearby', asyncHandler(foodController.getNearbyFood));

// GET /api/food/:id — Get single food listing
router.get('/:id', asyncHandler(foodController.getFoodById));

// POST /api/food — Create new food listing (with image upload)
router.post('/', upload.single('image'), asyncHandler(foodController.createFood));

// PUT /api/food/:id — Update food listing
router.put('/:id', asyncHandler(foodController.updateFood));

// DELETE /api/food/:id — Delete food listing
router.delete('/:id', asyncHandler(foodController.deleteFood));

module.exports = router;
