const {
  getAllAvailableFood,
  seedDemoListingsIfEmpty,
  getNearbyAvailableFood,
  getFoodById: getFoodByIdQuery,
  createFoodListing,
  updateFoodListing,
  deleteFoodListing
} = require('../../database/queries/food.queries');
const { uploadFoodImage, hasCloudinaryConfig } = require('../services/cloudinary.service');

const buildImageDataUrl = (file) => {
  if (!file?.buffer || !file?.mimetype) return null;
  const encoded = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${encoded}`;
};

const getAllFood = async (req, res) => {
  let items = await getAllAvailableFood();
  if (!items.length) {
    await seedDemoListingsIfEmpty();
    items = await getAllAvailableFood();
  }
  res.json({ items });
};

const getNearbyFood = async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  const parsedRadius = Number(radius);

  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
    return res.status(400).json({ error: 'lat and lng query params must be valid numbers.' });
  }

  const items = await getNearbyAvailableFood({
    lat: parsedLat,
    lng: parsedLng,
    radiusKm: Number.isFinite(parsedRadius) ? parsedRadius : 5
  });

  return res.json({ items });
};

const getFoodById = async (req, res) => {
  const item = await getFoodByIdQuery(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Food listing not found.' });
  }
  return res.json(item);
};

const createFood = async (req, res) => {
  const {
    donorId,
    title,
    description,
    quantity,
    foodType,
    food_type,
    expiryTime,
    expiry_time,
    latitude,
    longitude,
    address,
    location_text,
    imageUrl
  } = req.body;

  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  const normalizedExpiry = expiryTime || expiry_time;
  let persistedImageUrl = imageUrl || null;

  if (!title || !quantity || !normalizedExpiry || !Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
    return res.status(400).json({
      error: 'title, quantity, expiry_time (or expiryTime), latitude, and longitude are required.'
    });
  }

  if (req.file) {
    if (hasCloudinaryConfig()) {
      try {
        persistedImageUrl = await uploadFoodImage(req.file);
      } catch (error) {
        console.warn('Cloudinary upload failed, using inline image fallback:', error.message);
        persistedImageUrl = buildImageDataUrl(req.file);
      }
    } else {
      persistedImageUrl = buildImageDataUrl(req.file);
    }
  }

  const item = await createFoodListing({
    donorId: req.user?.id || donorId || null,
    title,
    description,
    quantity,
    foodType: foodType || food_type || null,
    expiryTime: normalizedExpiry,
    imageUrl: persistedImageUrl,
    latitude: parsedLatitude,
    longitude: parsedLongitude,
    address: address || location_text || null
  });

  return res.status(201).json(item);
};

const updateFood = async (req, res) => {
  const item = await updateFoodListing(req.params.id, req.body || {});
  if (!item) {
    return res.status(404).json({ error: 'Food listing not found.' });
  }
  return res.json(item);
};

const deleteFood = async (req, res) => {
  const removed = await deleteFoodListing(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Food listing not found.' });
  }
  return res.json({ success: true, deleted: removed.id });
};

module.exports = { getAllFood, getNearbyFood, getFoodById, createFood, updateFood, deleteFood };
