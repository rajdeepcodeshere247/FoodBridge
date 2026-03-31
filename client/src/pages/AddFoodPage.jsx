import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodForm from '../components/food/FoodForm';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { createFood } from '../services/food.service';
import './AddFoodPage.css';

function AddFoodPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'
  const navigate = useNavigate();
  useScrollReveal();

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setMessage('');
    try {
      await createFood(payload);
      setMessageType('success');
      setMessage('Food listing created successfully!');
      setTimeout(() => navigate('/foods'), 1400);
    } catch {
      setMessageType('error');
      setMessage('Could not create listing. Please verify backend connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="afp-page">
      {/* background blobs */}
      <div className="afp-blob afp-blob--1" />
      <div className="afp-blob afp-blob--2" />

      <div className="afp-inner">
        {/* header */}
        <div className="afp-header fb-reveal">
          <span className="afp-eyebrow">🥗 New Listing</span>
          <h1 className="afp-title">Add a Food Donation</h1>
          <p className="afp-subtitle">
            Provide quantity, expiry, and location so volunteers can act quickly.
          </p>
        </div>

        {/* card shell */}
        <section className="afp-card fb-reveal">
          <FoodForm onSubmit={handleSubmit} submitting={submitting} />
        </section>

        {/* status message */}
        {message && (
          <div className={`afp-notice afp-notice--${messageType} fb-reveal is-visible`}>
            <span className="afp-notice-icon">
              {messageType === 'success' ? '✅' : '⚠️'}
            </span>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddFoodPage;
