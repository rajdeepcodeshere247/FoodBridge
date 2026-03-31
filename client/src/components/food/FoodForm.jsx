import React, { useState } from 'react';
import { checkFoodQuality } from '../../services/ai.service';
import { geocodeAddress } from '../../services/food.service';
import FoodQualityBadge from './FoodQualityBadge';

const defaultForm = {
  title: '',
  description: '',
  quantity: '',
  expiry_time: '',
  location_text: '',
  latitude: '',
  longitude: '',
};

function FoodForm({ onSubmit, submitting = false }) {
  const [formData, setFormData] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [quality, setQuality] = useState(null);
  const [checking, setChecking] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [lastLookupAt, setLastLookupAt] = useState(0);

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
    if (typeof quality?.confidence === 'number')
      payload.append('confidence_score', quality.confidence);
    onSubmit(payload);
  };

  const handleLookupLocation = async () => {
    const address = formData.location_text.trim();
    if (!address) {
      setLocationMessage('Please type a location address first.');
      return;
    }
    const now = Date.now();
    if (now - lastLookupAt < 1000) {
      setLocationMessage('Please wait a second before searching again (Nominatim policy).');
      return;
    }
    setSearchingLocation(true);
    setLocationMessage('');
    setLastLookupAt(now);
    try {
      const { data } = await geocodeAddress(address);
      setFormData((prev) => ({
        ...prev,
        latitude: String(data.latitude),
        longitude: String(data.longitude),
      }));
      setLocationMessage(`📍 Found: ${data.displayName}`);
    } catch {
      setLocationMessage('No location found. Please refine the address.');
    } finally {
      setSearchingLocation(false);
    }
  };

  return (
    <form className="fb-form" onSubmit={submit}>

      {/* ── Basic info ── */}
      <div className="fb-form-section">
        <label className="fb-form-label">
          <span className="lbl-icon">🍱</span> Food Title
        </label>
        <input
          name="title"
          placeholder="e.g. Rice & Dal – 20 portions"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="fb-form-section">
        <label className="fb-form-label">
          <span className="lbl-icon">📝</span> Description
        </label>
        <textarea
          name="description"
          placeholder="Describe freshness, allergens, packaging…"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="fb-form-row">
        <div className="fb-form-section">
          <label className="fb-form-label">
            <span className="lbl-icon">🔢</span> Quantity
          </label>
          <input
            name="quantity"
            placeholder="e.g. 20 meals"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="fb-form-section">
          <label className="fb-form-label">
            <span className="lbl-icon">⏰</span> Expiry
          </label>
          <input
            name="expiry_time"
            type="datetime-local"
            value={formData.expiry_time}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <hr className="fb-form-rule" />

      {/* ── Location ── */}
      <div className="fb-form-section">
        <label className="fb-form-label">
          <span className="lbl-icon">📍</span> Pickup Location
        </label>
        <input
          name="location_text"
          placeholder="Type a full address"
          value={formData.location_text}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="button"
        className="fb-btn-secondary"
        onClick={handleLookupLocation}
        disabled={searchingLocation}
      >
        {searchingLocation ? (
          <>⏳ Finding location…</>
        ) : (
          <>🗺️ Find Coordinates from Address</>
        )}
      </button>

      {locationMessage && (
        <p className="fb-notice">{locationMessage}</p>
      )}

      <div className="fb-form-row">
        <div className="fb-form-section">
          <label className="fb-form-label">Latitude</label>
          <input
            name="latitude"
            type="number"
            step="any"
            placeholder="Auto-filled"
            value={formData.latitude}
            onChange={handleChange}
            required
          />
        </div>
        <div className="fb-form-section">
          <label className="fb-form-label">Longitude</label>
          <input
            name="longitude"
            type="number"
            step="any"
            placeholder="Auto-filled"
            value={formData.longitude}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <hr className="fb-form-rule" />

      {/* ── Image & AI ── */}
      <div className="fb-form-section">
        <label className="fb-form-label">
          <span className="lbl-icon">📷</span> Food Photo
        </label>
        <label className="fb-file-label">
          <span>📁 Choose image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          {imageFile ? (
            <span className="fb-file-name">{imageFile.name}</span>
          ) : (
            <span className="fb-file-name" style={{ opacity: 0.5 }}>No file chosen</span>
          )}
        </label>
      </div>

      <button
        type="button"
        className="fb-btn-secondary"
        onClick={handleQualityCheck}
        disabled={!imageFile || checking}
      >
        {checking ? <>⏳ Checking quality…</> : <>🤖 Run AI Quality Check</>}
      </button>

      {quality && (
        <FoodQualityBadge status={quality.status} confidenceScore={quality.confidence} />
      )}

      <hr className="fb-form-rule" />

      {/* ── Submit ── */}
      <button type="submit" className="fb-btn" disabled={submitting}>
        <span>{submitting ? '⏳ Submitting…' : '✅ Create Listing'}</span>
      </button>
    </form>
  );
}

export default FoodForm;
