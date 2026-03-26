// Delivery controller — volunteer pickup management
// const pool = require('../config/db.config');

const getAllDeliveries = async (req, res) => {
  // TODO: SELECT deliveries with food listing and requester info
};

const claimDelivery = async (req, res) => {
  // TODO: INSERT into deliveries, UPDATE food_listings status to 'claimed'
};

const updateStatus = async (req, res) => {
  // TODO: UPDATE deliveries SET status = $1 WHERE id = $2
  // Status values: pending → picked_up → delivered
};

module.exports = { getAllDeliveries, claimDelivery, updateStatus };
