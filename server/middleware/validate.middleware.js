// Request validation middleware — validate incoming request bodies

const validateFoodListing = (req, res, next) => {
  const { title, quantity, expiry_time, latitude, longitude } = req.body;
  if (!title || !quantity || !expiry_time || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required fields: title, quantity, expiry_time, latitude, longitude' });
  }
  next();
};

const validateUserUpdate = (req, res, next) => {
  const { name, role } = req.body;
  const validRoles = ['donor', 'volunteer', 'ngo', 'admin'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${validRoles.join(', ')}` });
  }
  next();
};

module.exports = { validateFoodListing, validateUserUpdate };
