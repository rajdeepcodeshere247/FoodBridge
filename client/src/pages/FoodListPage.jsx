import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FoodList from '../components/food/FoodList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLocationContext } from '../context/LocationContext';
import { getAllFood, getNearbyFood } from '../services/food.service';
import { calculateDistanceKm, getPriorityMeta, inferFoodType, normalizeQualityStatus } from '../utils/helpers';

function FoodListPage() {
  const navigate = useNavigate();
  const { location } = useLocationContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
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
        const response = location
          ? await getNearbyFood(location.lat, location.lng, 10)
          : await getAllFood();

        const payload = Array.isArray(response.data) ? response.data : (response.data?.items || []);
        localStorage.setItem('fb-cached-listings', JSON.stringify(payload));
        if (mounted) {
          setItems(payload);
          setOfflineMode(false);
        }
      } catch {
        const cached = localStorage.getItem('fb-cached-listings');
        if (cached && mounted) {
          setItems(JSON.parse(cached));
          setOfflineMode(true);
        } else if (mounted) {
          setItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadListings();

    const poll = setInterval(async () => {
      try {
        const response = location
          ? await getNearbyFood(location.lat, location.lng, 10)
          : await getAllFood();
        const payload = Array.isArray(response.data) ? response.data : (response.data?.items || []);
        setItems((current) => {
          if (payload.length > current.length) {
            toast.info('🔔 New food added near you.');
          }
          return payload;
        });
      } catch {
        // keep current state on polling failures
      }
    }, 45000);

    return () => {
      mounted = false;
      clearInterval(poll);
    };
  }, [location]);

  const preparedItems = useMemo(() => items.map((item) => {
    const distanceKm = calculateDistanceKm(location, { lat: item.latitude, lng: item.longitude });
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
    const expiryLimitMinutes = {
      '1h': 60,
      '3h': 180,
      '6h': 360
    };

    return preparedItems.filter((item) => {
      const query = searchText.trim().toLowerCase();
      const textMatch = !query ||
        (item.title || '').toLowerCase().includes(query) ||
        (item.location_text || '').toLowerCase().includes(query);

      const distanceMatch =
        distanceFilter === 'all' ||
        (typeof item.distanceKm === 'number' && item.distanceKm <= Number(distanceFilter));

      const typeMatch = foodTypeFilter === 'all' || item.foodType === foodTypeFilter;
      const qualityMatch = qualityFilter === 'all' || item.quality_status === qualityFilter;

      let expiryMatch = true;
      if (expiryFilter !== 'all') {
        const minutesLeft = (new Date(item.expiry_time) - now) / (1000 * 60);
        expiryMatch = minutesLeft > 0 && minutesLeft <= expiryLimitMinutes[expiryFilter];
      }

      return textMatch && distanceMatch && typeMatch && qualityMatch && expiryMatch;
    }).sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY);
      }

      if (sortBy === 'expiry') {
        return new Date(a.expiry_time) - new Date(b.expiry_time);
      }

      if (a.priority.rank !== b.priority.rank) {
        return a.priority.rank - b.priority.rank;
      }

      return (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY);
    });
  }, [preparedItems, searchText, distanceFilter, foodTypeFilter, qualityFilter, expiryFilter, sortBy]);

  const handleRequestFood = (food) => {
    toast.success(`Food request sent for ${food.title}.`);
  };

  const handleViewMap = (food) => {
    navigate(`/map?focus=${food.id}`);
  };

  return (
    <div className="fb-page">
      <div className="fb-reveal">
        <h1>Smart Food Queue</h1>
        <p className="fb-subtitle">Fast decisions first: urgent items rise to the top, with route-ready actions.</p>
        {offlineMode && <p className="fb-notice">📶 Low internet mode: showing last cached listings.</p>}
      </div>

      <section className="fb-panel fb-reveal">
        <div className="fb-filters-grid">
          <input
            className="fb-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by food name or location"
          />
          <select className="fb-input" value={distanceFilter} onChange={(e) => setDistanceFilter(e.target.value)}>
            <option value="all">Distance: Any</option>
            <option value="1">Within 1 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>
          <select className="fb-input" value={foodTypeFilter} onChange={(e) => setFoodTypeFilter(e.target.value)}>
            <option value="all">Food type: Any</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-veg</option>
          </select>
          <select className="fb-input" value={expiryFilter} onChange={(e) => setExpiryFilter(e.target.value)}>
            <option value="all">Expiry: Any</option>
            <option value="1h">Within 1 hour</option>
            <option value="3h">Within 3 hours</option>
            <option value="6h">Within 6 hours</option>
          </select>
          <select className="fb-input" value={qualityFilter} onChange={(e) => setQualityFilter(e.target.value)}>
            <option value="all">AI quality: Any</option>
            <option value="fresh">Fresh</option>
            <option value="medium">Eat soon</option>
            <option value="spoiled">Avoid</option>
          </select>
          <select className="fb-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="priority">Sort: Priority</option>
            <option value="distance">Sort: Distance</option>
            <option value="expiry">Sort: Expiry</option>
          </select>
        </div>

        <div className="fb-toolbar">
          <strong>{filteredItems.length} listing{filteredItems.length === 1 ? "" : "s"} found</strong>
        </div>
      </section>

      <section>
        {loading ? <LoadingSpinner /> : (
          <FoodList
            items={filteredItems}
            onAcceptPickup={handleRequestFood}
            onViewMap={handleViewMap}
            userLocation={location}
          />
        )}
      </section>
    </div>
  );
}

export default FoodListPage;
