// Authentication middleware — protect routes that require login

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized. Please log in.' });
};

const isVolunteer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'volunteer') return next();
  res.status(403).json({ error: 'Forbidden. Volunteers only.' });
};

const isDonor = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'donor') return next();
  res.status(403).json({ error: 'Forbidden. Donors only.' });
};

module.exports = { isAuthenticated, isVolunteer, isDonor };
