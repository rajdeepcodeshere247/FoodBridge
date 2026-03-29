// SQL queries for food_listings table
const pool = require('../../server/config/db.config');

const getAllAvailableFood = async () => {
  const result = await pool.query(
    "SELECT * FROM food_listings WHERE status = 'available' ORDER BY created_at DESC"
  );
  return result.rows;
};

const seedDemoListingsIfEmpty = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const countResult = await client.query("SELECT COUNT(*)::int AS total FROM food_listings WHERE status = 'available'");
    if (countResult.rows[0].total > 0) {
      await client.query('COMMIT');
      return false;
    }

    const donorResult = await client.query(
      `INSERT INTO users (name, email, role)
       VALUES ($1, $2, 'donor')
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      ['FoodBridge Demo Donor', 'demo.donor@foodbridge.local']
    );
    const donorId = donorResult.rows[0].id;

    await client.query(
      `INSERT INTO food_listings
      (donor_id, title, description, quantity, food_type, expiry_time, latitude, longitude, address, status)
      VALUES
      ($1, 'Cooked Rice & Dal', 'Freshly prepared lunch surplus from community kitchen.', '20 plates', 'veg', NOW() + INTERVAL '5 hours', 22.5726, 88.3639, 'Park Street, Kolkata', 'available'),
      ($1, 'Bread & Vegetable Curry', 'Evening meal packs ready for pickup.', '12 packs', 'veg', NOW() + INTERVAL '3 hours', 22.5800, 88.3700, 'Esplanade, Kolkata', 'available')`,
      [donorId]
    );

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getNearbyAvailableFood = async ({ lat, lng, radiusKm = 5 }) => {
  const result = await pool.query(
    `SELECT * FROM (
      SELECT *,
      (
        6371 * acos(
          cos(radians($1)) * cos(radians(latitude::double precision)) *
          cos(radians(longitude::double precision) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude::double precision))
        )
      ) AS distance_km
      FROM food_listings
      WHERE status = 'available'
    ) nearby
    WHERE distance_km <= $3
    ORDER BY distance_km ASC, created_at DESC`,
    [lat, lng, radiusKm]
  );

  return result.rows;
};

const getFoodById = async (id) => {
  const result = await pool.query('SELECT * FROM food_listings WHERE id = $1', [id]);
  return result.rows[0];
};

const createFoodListing = async (data) => {
  const { donorId, title, description, quantity, foodType, expiryTime, imageUrl, latitude, longitude, address } = data;
  const result = await pool.query(
    `INSERT INTO food_listings (donor_id, title, description, quantity, food_type, expiry_time, image_url, latitude, longitude, address)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [donorId, title, description, quantity, foodType, expiryTime, imageUrl, latitude, longitude, address]
  );
  return result.rows[0];
};

const updateFoodListing = async (id, fields) => {
  const allowed = {
    title: 'title',
    description: 'description',
    quantity: 'quantity',
    foodType: 'food_type',
    expiryTime: 'expiry_time',
    imageUrl: 'image_url',
    latitude: 'latitude',
    longitude: 'longitude',
    address: 'address',
    status: 'status'
  };

  const updates = Object.entries(fields)
    .filter(([key, value]) => Object.prototype.hasOwnProperty.call(allowed, key) && value !== undefined);

  if (!updates.length) return getFoodById(id);

  const setClause = updates.map(([key], idx) => `${allowed[key]} = $${idx + 2}`).join(', ');
  const values = [id, ...updates.map(([, value]) => value)];

  const result = await pool.query(
    `UPDATE food_listings SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );

  return result.rows[0];
};

const deleteFoodListing = async (id) => {
  const result = await pool.query('DELETE FROM food_listings WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAllAvailableFood,
  seedDemoListingsIfEmpty,
  getNearbyAvailableFood,
  getFoodById,
  createFoodListing,
  updateFoodListing,
  deleteFoodListing
};
