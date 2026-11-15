const { cloudinary } = require('../config/cloudinary');

/**
 * Uploads a single file buffer to Cloudinary with WebP/AVIF auto-optimisation
 */
const uploadBufferToCloudinary = (buffer, folder = 'aaranya/products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width || 800,
          height: result.height || 1000,
        });
      }
    );
    stream.end(buffer);
  });
};

/**
 * Safely deletes a Cloudinary asset by publicId; logs warnings without crashing
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('demo_')) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn(`[Cloudinary Cleanup Warning] Failed to delete ${publicId}:`, err.message);
  }
};

module.exports = { uploadBufferToCloudinary, deleteFromCloudinary };
