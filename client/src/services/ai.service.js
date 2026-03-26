// AI food quality check API call
import api from './api';

export const checkFoodQuality = (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  return api.post('/ai/check-quality', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
