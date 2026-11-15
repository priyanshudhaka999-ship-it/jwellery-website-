const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('[Cloudinary] Credentials missing in .env. Image uploads will fail until configured.');
    return;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
};

/**
 * Generates an optimised responsive Cloudinary delivery URL with automatic
 * WebP/AVIF format negotiation and quality compression.
 */
const getOptimisedImageUrl = (url, width = 800) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
};

module.exports = { cloudinary, configureCloudinary, getOptimisedImageUrl };
