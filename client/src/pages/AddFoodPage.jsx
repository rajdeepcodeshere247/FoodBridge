import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodForm from '../components/food/FoodForm';
import { createFood } from '../services/food.service';

function AddFoodPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setMessage('');
    try {
      await createFood(payload);
      setMessage('Food listing created successfully!');
      setTimeout(() => navigate('/foods'), 600);
    } catch {
      setMessage('Could not create listing. Please verify backend connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fb-page">
      <h1>Add a Food Donation</h1>
      <p className="fb-subtitle">Provide quantity, expiry, and location so volunteers can act quickly.</p>
      <FoodForm onSubmit={handleSubmit} submitting={submitting} />
      {message && <p className="fb-notice">{message}</p>}
    </div>
  );
}

export default AddFoodPage;
