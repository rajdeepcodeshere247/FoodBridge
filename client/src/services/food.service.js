// Food listing API calls
import api from './api';

export const getAllFood = () => api.get('/food');
export const getNearbyFood = (lat, lng, radius = 5) =>
  api.get(`/food/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
export const getFoodById = (id) => api.get(`/food/${id}`);
export const createFood = (formData) =>
  api.post('/food', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateFood = (id, data) => api.put(`/food/${id}`, data);
export const deleteFood = (id) => api.delete(`/food/${id}`);
