// Utility helpers for backend

// Calculate distance between two lat/lng points (Haversine formula)
// Returns distance in kilometers
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Check if a food listing has expired
const isExpired = (expiryTime) => new Date(expiryTime) < new Date();

// Format API response consistently
const apiResponse = (res, statusCode, data, message = '') =>
  res.status(statusCode).json({ success: statusCode < 400, message, data });

module.exports = { haversineDistance, isExpired, apiResponse };
