const crypto = require('crypto');
const axios = require('axios');
const { createDonation, markDonationPaid } = require('../../database/queries/donation.queries');

const hasRazorpayConfig = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

const createRazorpayOrder = async ({ amountInPaise, receipt, donorName, donorEmail, message }) => {
  const authToken = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');

  const response = await axios.post(
    'https://api.razorpay.com/v1/orders',
    {
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        donorName,
        donorEmail,
        message: message || ''
      }
    },
    {
      headers: {
        Authorization: `Basic ${authToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};

const createDonationOrder = async (req, res) => {
  const { amount, donorName, donorEmail, message } = req.body;

  if (!amount || Number(amount) < 1) {
    return res.status(400).json({ error: 'Donation amount must be at least ₹1.' });
  }

  if (!donorName || !donorEmail) {
    return res.status(400).json({ error: 'Donor name and email are required.' });
  }

  const amountInPaise = Math.round(Number(amount) * 100);
  const receipt = `fb_donation_${Date.now()}`;

  if (!hasRazorpayConfig()) {
    const donation = await createDonation({
      donorName,
      donorEmail,
      amount: Number(amount),
      message,
      paymentGateway: 'manual',
      paymentStatus: 'pending'
    });

    return res.status(200).json({
      donation,
      gateway: 'manual',
      message: 'Payment gateway keys are not configured. Please configure Razorpay keys to enable online payments.'
    });
  }

  const order = await createRazorpayOrder({
    amountInPaise,
    receipt,
    donorName,
    donorEmail,
    message
  });

  const donation = await createDonation({
    donorName,
    donorEmail,
    amount: Number(amount),
    message,
    paymentGateway: 'razorpay',
    paymentOrderId: order.id,
    paymentStatus: 'created'
  });

  return res.status(201).json({
    donation,
    gateway: 'razorpay',
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    order,
    supportedMethods: ['upi', 'card', 'netbanking', 'wallet']
  });
};

const verifyDonationPayment = async (req, res) => {
  const { donationId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature, method } = req.body;

  if (!donationId || !orderId || !paymentId || !signature) {
    return res.status(400).json({ error: 'Missing payment verification fields.' });
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(400).json({ error: 'RAZORPAY_KEY_SECRET is required for payment verification.' });
  }

  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).json({ error: 'Invalid payment signature.' });
  }

  const donation = await markDonationPaid({
    donationId,
    paymentId,
    paymentMethod: method || null
  });

  if (!donation) {
    return res.status(404).json({ error: 'Donation record not found.' });
  }

  return res.status(200).json({ success: true, donation });
};

module.exports = {
  createDonationOrder,
  verifyDonationPayment
};
