const os = require('os');
const path = require('path');

const isServerlessRuntime = Boolean(process.env.VERCEL);
const uploadsDir = isServerlessRuntime
  ? path.join(os.tmpdir(), 'foodbridge-uploads')
  : path.join(__dirname, '..', 'uploads');

module.exports = {
  uploadsDir,
  isServerlessRuntime
};
