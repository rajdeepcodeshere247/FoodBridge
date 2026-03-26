// Food controller — CRUD operations for food listings
// const pool = require('../config/db.config');

const getAllFood = async (req, res) => {
  // TODO: SELECT * FROM food_listings WHERE status = 'available' ORDER BY created_at DESC
};

const getNearbyFood = async (req, res) => {
  // TODO: Use lat/lng from query params, use PostGIS or Haversine formula for proximity search
  // const { lat, lng, radius = 5 } = req.query;
};

const getFoodById = async (req, res) => {
  // TODO: SELECT * FROM food_listings WHERE id = $1
};

const createFood = async (req, res) => {
  // TODO: INSERT into food_listings, also trigger AI quality check if image present
};

const updateFood = async (req, res) => {
  // TODO: UPDATE food_listings SET ... WHERE id = $1
};

const deleteFood = async (req, res) => {
  // TODO: DELETE FROM food_listings WHERE id = $1 (check ownership first)
};

module.exports = { getAllFood, getNearbyFood, getFoodById, createFood, updateFood, deleteFood };
