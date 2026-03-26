// User profile routes
const express = require('express');
const router = express.Router();
// const userController = require('../controllers/user.controller');
// const { isAuthenticated } = require('../middleware/auth.middleware');

// GET /api/users/:id — Get user profile
router.get('/:id', /* userController.getUser */);

// PUT /api/users/:id — Update user profile (name, role, etc.)
router.put('/:id', /* isAuthenticated, userController.updateUser */);

// GET /api/users/:id/donations — Get donation history of a user
router.get('/:id/donations', /* userController.getUserDonations */);

// GET /api/users/:id/deliveries — Get delivery history of a volunteer
router.get('/:id/deliveries', /* userController.getUserDeliveries */);

module.exports = router;
