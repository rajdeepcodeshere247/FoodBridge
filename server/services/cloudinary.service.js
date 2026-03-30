// cloudinary.service.js

const resolveCloudinaryConfig = () => {
  return {
    cloudName: (
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD ||
      process.env.CLOUD_NAME ||
      ''
    ).trim(),
    uploadPreset: (
      process.env.CLOUDINARY_UPLOAD_PRESET ||
      process.env.CLOUDINARY_UNSIGNED_UPLOAD_PRESET ||
      process.env.CLOUDINARY_PRESET ||
      ''
    ).trim(),
    folder: (process.env.CLOUDINARY_FOLDER || '').trim() // FIX: Explicitly include the folder variable
  };
};

const hasCloudinaryConfig = () => {
  const { cloudName, uploadPreset } = resolveCloudinaryConfig();
  return Boolean(cloudName && uploadPreset);
};

const uploadFoodImage = async (file) => {
  if (!file?.buffer) return null;

  // FIX: Get all config, including folder
  const { cloudName, uploadPreset, folder } = resolveCloudinaryConfig();
  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary upload attempted without cloudName or uploadPreset.');
    return null;
  }

  const formData = new FormData();
  // Standardize file input for FormData in a Node.js environment
  const blob = new Blob([file.buffer], { type: file.mimetype || 'application/octet-stream' });
  formData.append('file', blob, file.originalname || 'food-image.jpg');
  formData.append('upload_preset', uploadPreset);

  if (folder) { // FIX: Use the resolved folder value
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const payload = await response.json();
    if (!response.ok) {
      // FIX: Crucial for debugging! This tells you EXACTLY why Cloudinary rejected the upload.
      console.error('Cloudinary API Error Response:', payload.error);
      throw new Error(payload?.error?.message || 'Failed to upload image to Cloudinary');
    }

    return payload.secure_url || payload.url || null;
  } catch (err) {
    // FIX: Logs any network or other JavaScript exceptions.
    console.error('Cloudinary Upload Service Exception:', err.message);
    throw err;
  }
};

module.exports = {
  uploadFoodImage,
  hasCloudinaryConfig
};
