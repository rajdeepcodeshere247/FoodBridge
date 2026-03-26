import React, { useState } from 'react';
import { checkFoodQuality } from '../../services/ai.service';
import FoodQualityBadge from './FoodQualityBadge';

const defaultForm = {
  title: '',
  description: '',
  quantity: '',
  expiry_time: '',
  location_text: '',
  latitude: '',
  longitude: ''
};

function FoodForm({ onSubmit, submitting = false }) {
  const [formData, setFormData] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [quality, setQuality] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQualityCheck = async () => {
    if (!imageFile) return;
    setChecking(true);
    try {
      const res = await checkFoodQuality(imageFile);
      setQuality(res.data?.result || null);
    } catch {
      setQuality({ status: 'moderate', confidence: 0.5 });
    } finally {
      setChecking(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    if (imageFile) payload.append('image', imageFile);
    if (quality?.status) payload.append('quality_status', quality.status);
    if (typeof quality?.confidence === 'number') payload.append('confidence_score', quality.confidence);
    onSubmit(payload);
  };

  return (
    <form className="fb-form" onSubmit={submit}>
      <input name="title" placeholder="Food title" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Describe the food" value={formData.description} onChange={handleChange} rows={3} />
      <input name="quantity" placeholder="Quantity (e.g. 20 meals)" value={formData.quantity} onChange={handleChange} required />
      <input name="expiry_time" type="datetime-local" value={formData.expiry_time} onChange={handleChange} required />
      <input name="location_text" placeholder="Pickup location" value={formData.location_text} onChange={handleChange} required />
      <div className="fb-form-row">
        <input name="latitude" type="number" step="any" placeholder="Latitude" value={formData.latitude} onChange={handleChange} />
        <input name="longitude" type="number" step="any" placeholder="Longitude" value={formData.longitude} onChange={handleChange} />
      </div>
      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      <button type="button" className="fb-btn-secondary" onClick={handleQualityCheck} disabled={!imageFile || checking}>
        {checking ? 'Checking...' : 'Run AI Quality Check'}
      </button>
      {quality && <FoodQualityBadge status={quality.status} confidenceScore={quality.confidence} />}
      <button type="submit" className="fb-btn" disabled={submitting}>{submitting ? 'Submitting...' : 'Create Listing'}</button>
    </form>
  );
}

export default FoodForm;
