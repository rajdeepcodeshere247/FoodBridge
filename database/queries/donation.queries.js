const pool = require('../../server/config/db.config');

const createDonation = async ({
  donorName,
  donorEmail,
  amount,
  currency = 'INR',
  message = null,
  paymentGateway = 'razorpay',
  paymentMethod = null,
  paymentOrderId = null,
  paymentId = null,
  paymentStatus = 'created'
}) => {
  const result = await pool.query(
    `INSERT INTO donations
      (donor_name, donor_email, amount, currency, message, payment_gateway, payment_method, payment_order_id, payment_id, payment_status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      donorName,
      donorEmail,
      amount,
      currency,
      message,
      paymentGateway,
      paymentMethod,
      paymentOrderId,
      paymentId,
      paymentStatus
    ]
  );

  return result.rows[0];
};

const markDonationPaid = async ({ donationId, paymentId, paymentMethod = null }) => {
  const result = await pool.query(
    `UPDATE donations
     SET payment_status = 'paid', payment_id = $2, payment_method = COALESCE($3, payment_method), paid_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [donationId, paymentId, paymentMethod]
  );

  return result.rows[0];
};

module.exports = {
  createDonation,
  markDonationPaid
};
