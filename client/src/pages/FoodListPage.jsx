import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { getAllFood } from '../services/food.service';
import { calculateDistanceKm, getPriorityMeta, inferFoodType, normalizeQualityStatus } from '../utils/helpers';
import './FoodListPage.css'; 

export function FoodCard({ item, user, onRequest, onViewMap, onViewDetails }) {
  const isOwner = user && (item.donor_id === user.id || item.user_id === user.id);

  const getQualityColor = (status) => {
    if (status === 'fresh') return 'badge-fresh';
    if (status === 'medium') return 'badge-medium';
    return 'badge-spoiled';
  };

  const formatTimeLeft = (expiryDate) => {
    if (!expiryDate) return 'Unknown';
    const diff = new Date(expiryDate) - new Date();
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
    if (days >= 1) {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const displayLocation = 
    item.location_text || 
    item.address || 
    item.city || 
    item.location_name || 
    (typeof item.location === 'string' ? item.location : null) || 
    'Not specified';

  return (
    <div className="fl-card">
      <div className="fl-card-image-wrap">
        <img 
          src={item.image_url || 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=600&q=80'} 
          alt={item.title} 
          className="fl-card-img" 
        />
        <div className={`fl-badge-quality ${getQualityColor(item.quality_status)}`}>
          <span className="dot"></span> {item.quality_status || 'Safe'}
        </div>
        
        {typeof item.distanceKm === 'number' && !isNaN(item.distanceKm) && (
          <div className="fl-badge-distance">
            📍 {item.distanceKm.toFixed(1)} km
          </div>
        )}
      </div>

      <div className="fl-card-body">
        <div className="fl-card-header">
          <h3 className="fl-title">{item.title}</h3>
          <span className={`fl-priority-tag priority-${item.priority?.rank || 1}`}>
            {item.priority?.label || 'MEDIUM'}
          </span>
        </div>

        <p className="fl-desc">{item.description || 'No description provided.'}</p>

        <div className="fl-meta-grid">
          <div className="fl-meta-item">
            <span className="fl-meta-icon">📦</span>
            <div>
              <small>Quantity</small>
              <strong>{item.quantity || 'N/A'}</strong>
            </div>
          </div>
          <div className="fl-meta-item">
            <span className="fl-meta-icon">⏱️</span>
            <div>
              <small>Expires</small>
              <strong>{formatTimeLeft(item.expiry_time)}</strong>
            </div>
          </div>
          <div className="fl-meta-item full-width">
            <span className="fl-meta-icon">🏠</span>
            <div>
              <small>Location</small>
              <strong className="fl-truncate">{displayLocation}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="fl-card-actions">
        <button 
          className="fl-btn-primary"
          onClick={() => onRequest(item)}
          disabled={isOwner}
        >
          {isOwner ? 'Your Listing' : 'Request Food'}
        </button>
        <div className="fl-btn-group">
          <button className="fl-btn-secondary" onClick={() => onViewMap(item)}>
            Map
          </button>
          <button className="fl-btn-secondary" onClick={() => onViewDetails(item)}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FoodListPage() {
  const navigate = useNavigate();
  const { location } = useLocationContext();
  const { user } = useAuth(); 
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchText, setSearchText] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  useScrollReveal([items.length, loading]);

  useEffect(() => {
    let mounted = true;

    const loadListings = async () => {
      setLoading(true);
      try {
        const response = await getAllFood();
        const payload = Array.isArray(response.data) ? response.data : (response.data?.items || []);
        localStorage.setItem('fb-cached-listings', JSON.stringify(payload));
        if (mounted) {
          setItems(payload);
        }
      } catch {
        const cached = localStorage.getItem('fb-cached-listings');
        if (cached && mounted) {
          setItems(JSON.parse(cached));
        } else if (mounted) {
          setItems([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadListings();

    const poll = setInterval(async () => {
      try {
        const response = await getAllFood();
        const payload = Array.isArray(response.data) ? response.data : (response.data?.items || []);
        setItems((current) => {
          if (payload.length > current.length) toast.info('🔔 New food added.');
          return payload;
        });
      } catch {}
    }, 45000);

    return () => {
      mounted = false;
      clearInterval(poll);
    };
  }, []);

  const preparedItems = useMemo(() => items.map((item) => {
    const distanceKm = (location && item.latitude && item.longitude) 
      ? calculateDistanceKm(location, { lat: item.latitude, lng: item.longitude })
      : null;

    const qualityStatus = normalizeQualityStatus(item.quality_status, item.expiry_time);
    const priority = getPriorityMeta(item.expiry_time);

    return {
      ...item,
      distanceKm,
      priority,
      distanceLabel: typeof distanceKm === 'number' ? `${distanceKm.toFixed(1)} km away` : 'N/A',
      foodType: inferFoodType(item),
      quality_status: qualityStatus
    };
  }), [items, location]);

  const filteredItems = useMemo(() => {
    const now = new Date();
    const expiryLimitMinutes = { '1h': 60, '3h': 180, '6h': 360 };

    return preparedItems.filter((item) => {
      if (item.status === 'expired') return false;
      if (item.expiry_time && new Date(item.expiry_time) < now) return false;

      const query = searchText.trim().toLowerCase();
      const textMatch = !query || (item.title || '').toLowerCase().includes(query) || (item.location_text || '').toLowerCase().includes(query);
      const distanceMatch = distanceFilter === 'all' || (typeof item.distanceKm === 'number' && item.distanceKm <= Number(distanceFilter));
      const typeMatch = foodTypeFilter === 'all' || item.foodType === foodTypeFilter;
      const qualityMatch = qualityFilter === 'all' || item.quality_status === qualityFilter;

      let expiryMatch = true;
      if (expiryFilter !== 'all') {
        const minutesLeft = (new Date(item.expiry_time) - now) / (1000 * 60);
        expiryMatch = minutesLeft > 0 && minutesLeft <= expiryLimitMinutes[expiryFilter];
      }

      return textMatch && distanceMatch && typeMatch && qualityMatch && expiryMatch;
    }).sort((a, b) => {
      if (sortBy === 'distance') return (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY);
      if (sortBy === 'expiry') return new Date(a.expiry_time) - new Date(b.expiry_time);
      if (a.priority.rank !== b.priority.rank) return a.priority.rank - b.priority.rank;
      return (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY);
    });
  }, [preparedItems, searchText, distanceFilter, foodTypeFilter, qualityFilter, expiryFilter, sortBy]);

  return (
    <div className="fb-page">
      <div className="fb-reveal fl-header-section">
        <h1>Smart Food Queue</h1>
      </div>

      <section className="fl-filter-panel fb-reveal">
        <div className="fl-search-wrap">
          <svg className="fl-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            className="fl-search-input" 
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)} 
            placeholder="Search by food name, location, or donor..." 
          />
        </div>

        <div className="fl-filters-grid">
          <select className="fl-select" value={distanceFilter} onChange={(e) => setDistanceFilter(e.target.value)}>
            <option value="all">Distance: Any</option>
            <option value="1">Within 1 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>
          <select className="fl-select" value={foodTypeFilter} onChange={(e) => setFoodTypeFilter(e.target.value)}>
            <option value="all">Food type: Any</option>
            <option value="veg">🟢 Vegetarian</option>
            <option value="non-veg">🔴 Non-Veg</option>
          </select>
          <select className="fl-select" value={expiryFilter} onChange={(e) => setExpiryFilter(e.target.value)}>
            <option value="all">Expiry: Any</option>
            <option value="1h">Within 1 hour</option>
            <option value="3h">Within 3 hours</option>
            <option value="6h">Within 6 hours</option>
          </select>
          <select className="fl-select" value={qualityFilter} onChange={(e) => setQualityFilter(e.target.value)}>
            <option value="all">AI Quality: Any</option>
            <option value="fresh">Fresh</option>
            <option value="medium">Eat Soon</option>
            <option value="spoiled">Avoid</option>
          </select>
        </div>

        <div className="fl-toolbar-bottom">
          <span className="fl-results-count">
            <span className="dot"></span>
            {filteredItems.length} listing{filteredItems.length === 1 ? "" : "s"} found
          </span>
          
          <div className="fl-sort-wrap">
            <span className="fl-sort-label">Sort By</span>
            <select className="fl-select fl-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="priority">🔥 Priority</option>
              <option value="distance">📍 Distance</option>
              <option value="expiry">⏱️ Expiry</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="fl-card-grid fb-reveal">
            {filteredItems.map(item => (
              <FoodCard 
                key={item.id} 
                item={item} 
                user={user}
                onRequest={(food) => toast.success(`Food request sent for ${food.title}.`)}
                onViewMap={(food) => navigate(`/map?focus=${food.id}`)}
                onViewDetails={(food) => navigate(`/food/${food.id}`)}
              />
            ))}
            {filteredItems.length === 0 && (
              <div className="fl-empty-state">No food listings match your filters.</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
