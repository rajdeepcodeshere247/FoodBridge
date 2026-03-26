// AI controller — sends food image to AI API, returns quality result
const axios = require('axios');

const checkFoodQuality = async (req, res) => {
  try {
    // TODO: Read uploaded image from req.file
    // TODO: Send image (base64 or multipart) to AI_API_URL
    // TODO: Parse response — expect { status: 'fresh'|'moderate'|'spoiled', confidence: 0-1 }
    // TODO: Optionally save result to DB (food_listings.quality_status, quality_confidence)
    res.json({ quality_status: null, confidence: null, message: 'AI integration pending' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { checkFoodQuality };
