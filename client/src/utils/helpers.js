// Client-side utility functions

// Format expiry time as countdown string e.g. "2h 30m remaining"
export const formatExpiry = (expiryTime) => {
  const diff = new Date(expiryTime) - new Date();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m remaining` : `${minutes}m remaining`;
};

// Get badge color based on quality status
export const qualityColor = (status) => ({
  fresh: '#22c55e',
  medium: '#f59e0b',
  moderate: '#f59e0b',
  spoiled: '#ef4444',
  expired: '#ef4444',
}[status] || '#9ca3af');

export const getPriorityMeta = (expiryTime) => {
  const minutesLeft = (new Date(expiryTime) - new Date()) / (1000 * 60);

  if (minutesLeft <= 0) {
    return { level: 'expired', label: 'Expired', tone: 'spoiled', rank: 4 };
  }

  if (minutesLeft <= 90) {
    return { level: 'urgent', label: '🔴 Urgent', tone: 'urgent', rank: 0 };
  }

  if (minutesLeft <= 360) {
    return { level: 'medium', label: '🟡 Medium', tone: 'medium', rank: 1 };
  }

  return { level: 'safe', label: '🟢 Safe', tone: 'fresh', rank: 2 };
};

// Truncate long text for card previews
export const truncate = (str, max = 80) =>
  str && str.length > max ? str.slice(0, max) + '...' : str;

const toRadians = (value) => (value * Math.PI) / 180;

export const calculateDistanceKm = (from, to) => {
  if (!from || !to) return null;
  const fromLat = Number(from.lat);
  const fromLng = Number(from.lng);
  const toLat = Number(to.lat);
  const toLng = Number(to.lng);

  if ([fromLat, fromLng, toLat, toLng].some((v) => Number.isNaN(v))) {
    return null;
  }

  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

export const normalizeQualityStatus = (status = '', expiryTime) => {
  const normalized = (status || '').toLowerCase();
  if (new Date(expiryTime) < new Date()) return 'spoiled';
  if (normalized === 'moderate') return 'medium';
  if (['fresh', 'medium', 'spoiled'].includes(normalized)) return normalized;
  return 'medium';
};

export const inferFoodType = (item = {}) => {
  const explicit = (item.food_type || item.type || '').toLowerCase();
  if (explicit.includes('veg')) return explicit.includes('non') ? 'non-veg' : 'veg';

  const haystack = `${item.title || ''} ${item.description || ''}`.toLowerCase();
  const nonVegHints = ['chicken', 'mutton', 'beef', 'fish', 'egg', 'meat', 'prawn'];
  return nonVegHints.some((hint) => haystack.includes(hint)) ? 'non-veg' : 'veg';
};

export const getNavigationUrl = (food, location) => {
  if (!food?.latitude || !food?.longitude) return null;

  const destination = `${food.latitude},${food.longitude}`;
  if (location?.lat && location?.lng) {
    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${location.lat}%2C${location.lng}%3B${destination}`;
  }

  return `https://www.openstreetmap.org/?mlat=${food.latitude}&mlon=${food.longitude}#map=16/${food.latitude}/${food.longitude}`;
};


export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  const sanitizedPath = String(imageUrl).replace(/\\/g, '/').trim();
  if (sanitizedPath.startsWith('data:image/')) return sanitizedPath;
  if (/^https?:\/\//i.test(sanitizedPath)) return sanitizedPath;
  if (sanitizedPath.startsWith('/var/task/') || sanitizedPath.startsWith('/tmp/')) return '';

  const fromEnv = (process.env.REACT_APP_API_BASE_URL || '').trim().replace(/\/+$/, '');
  if (fromEnv) {
    const originFromEnv = fromEnv.endsWith('/api') ? fromEnv.slice(0, -4) : fromEnv;
    return `${originFromEnv}${sanitizedPath.startsWith('/') ? '' : '/'}${sanitizedPath}`;
  }

  if (typeof window !== 'undefined' && window.location.hostname.toLowerCase().endsWith('.vercel.app')) {
    return `https://foodbridge-backend.vercel.app${sanitizedPath.startsWith('/') ? '' : '/'}${sanitizedPath}`;
  }

  return sanitizedPath;
};
