// SQL queries for food_listings table
const pool = require('../../server/config/db.config');

const getAllAvailableFood = async () => {
  const result = await pool.query(
    "SELECT * FROM food_listings WHERE status = 'available' ORDER BY created_at DESC"
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

// TODO: getNearbyFood using Haversine formula
// TODO: updateFoodStatus, deleteFoodListing

module.exports = { getAllAvailableFood, getFoodById, createFoodListing };
