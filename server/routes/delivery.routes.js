// Delivery / volunteer pickup routes
const express = require('express');
const router = express.Router();
// const deliveryController = require('../controllers/delivery.controller');
// const { isAuthenticated } = require('../middleware/auth.middleware');

// GET /api/deliveries — Get all pending deliveries
router.get('/', /* deliveryController.getAllDeliveries */);

// POST /api/deliveries — Volunteer claims a food pickup
router.post('/', /* isAuthenticated, deliveryController.claimDelivery */);

// PUT /api/deliveries/:id/status — Update delivery status (picked_up, delivered)
router.put('/:id/status', /* isAuthenticated, deliveryController.updateStatus */);

module.exports = router;
