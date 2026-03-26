// AI food quality analysis service
// Sends food image to external AI API and returns freshness result
const axios = require('axios');
const fs = require('fs');

/**
 * Analyzes food image quality
 * @param {string} imagePath - local path to uploaded image file
 * @returns {{ quality_status: 'fresh'|'moderate'|'spoiled', confidence: number }}
 */
const analyzeFoodQuality = async (imagePath) => {
  // Convert image to base64
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  // TODO: Replace with your actual AI API call
  // Example using a generic vision API:
  const response = await axios.post(process.env.AI_API_URL, {
    image: base64Image,
    task: 'food_quality_check',
  }, {
    headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` }
  });

  // TODO: Parse response based on your AI provider's output format
  // Expected return format:
  return {
    quality_status: response.data.status,   // 'fresh' | 'moderate' | 'spoiled'
    confidence: response.data.confidence,   // 0.0 to 1.0
  };
};

module.exports = { analyzeFoodQuality };
