const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/async.middleware');
const donationController = require('../controllers/donation.controller');

router.post('/create-order', asyncHandler(donationController.createDonationOrder));
router.post('/verify-payment', asyncHandler(donationController.verifyDonationPayment));

module.exports = router;
