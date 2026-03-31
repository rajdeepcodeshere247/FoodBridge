import api from './api';

export const createDonationOrder = (payload) => api.post('/donations/create-order', payload);
export const verifyDonationPayment = (payload) => api.post('/donations/verify-payment', payload);
