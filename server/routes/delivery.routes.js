// Delivery / volunteer pickup routes
const express = require('express');
const router = express.Router();
const notImplemented = (feature) => (req, res) => {
  res.status(501).json({ error: `${feature} is not implemented yet.` });
};

// GET /api/deliveries — Get all pending deliveries
router.get('/', notImplemented('Get all deliveries'));

// POST /api/deliveries — Volunteer claims a food pickup
router.post('/', notImplemented('Claim delivery'));

// PUT /api/deliveries/:id/status — Update delivery status (picked_up, delivered)
router.put('/:id/status', notImplemented('Update delivery status'));

module.exports = router;
