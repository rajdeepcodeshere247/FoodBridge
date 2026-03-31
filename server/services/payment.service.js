const axios = require('axios');

const hasStripeEnabled = () => Boolean(process.env.STRIPE_SECRET_KEY);

const createStripeCheckoutSession = async ({
  amount,
  donorName,
  donorEmail,
  message,
  transactionId,
  successUrl,
  cancelUrl
}) => {
  if (!hasStripeEnabled()) {
    return null;
  }

  const params = new URLSearchParams();
  params.append('mode', 'payment');
  params.append('customer_email', donorEmail);
  params.append('success_url', successUrl);
  params.append('cancel_url', cancelUrl);
  params.append('metadata[donorName]', donorName);
  params.append('metadata[donorEmail]', donorEmail);
  params.append('metadata[message]', message || '');
  params.append('metadata[transactionId]', transactionId);
  params.append('line_items[0][quantity]', '1');
  params.append('line_items[0][price_data][currency]', 'inr');
  params.append('line_items[0][price_data][unit_amount]', String(Math.round(amount * 100)));
  params.append('line_items[0][price_data][product_data][name]', 'FoodBridge Donation');
  params.append(
    'line_items[0][price_data][product_data][description]',
    message || 'Donation to support meal rescue operations.'
  );

  const response = await axios.post('https://api.stripe.com/v1/checkout/sessions', params.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 20000
  });

  return response.data;
};

module.exports = {
  hasStripeEnabled,
  createStripeCheckoutSession
};
