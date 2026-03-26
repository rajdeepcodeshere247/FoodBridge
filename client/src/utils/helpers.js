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
  moderate: '#f59e0b',
  spoiled: '#ef4444',
}[status] || '#9ca3af');

// Truncate long text for card previews
export const truncate = (str, max = 80) =>
  str && str.length > max ? str.slice(0, max) + '...' : str;
