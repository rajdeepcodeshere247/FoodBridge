import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodForm from '../components/food/FoodForm';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { createFood } from '../services/food.service';

function AddFoodPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useScrollReveal();

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
      <div className="fb-reveal">
        <h1>Add a Food Donation</h1>
        <p className="fb-subtitle">Provide quantity, expiry, and location so volunteers can act quickly.</p>
      </div>
      <section className="fb-reveal">
        <FoodForm onSubmit={handleSubmit} submitting={submitting} />
      </section>
      {message && <p className="fb-notice fb-reveal is-visible">{message}</p>}
    </div>
  );
}

export default AddFoodPage;
