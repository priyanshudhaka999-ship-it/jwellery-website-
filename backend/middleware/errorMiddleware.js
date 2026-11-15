const mongoose = require('mongoose');

const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const idValue = req.params[paramName];
  if (idValue && !mongoose.Types.ObjectId.isValid(idValue) && paramName === 'id') {
    return res.status(400).json({
      success: false,
      message: `Invalid resource identifier format: ${idValue}`,
    });
  }
  next();
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';
  let fieldErrors = {};

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose Duplicate Key (SKU / Slug / Email)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${duplicateField} (${err.keyValue?.[duplicateField]}) already exists.`;
    fieldErrors[duplicateField] = message;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed. Please check the highlighted fields.';
    Object.keys(err.errors).forEach((key) => {
      fieldErrors[key] = err.errors[key].message;
    });
  }

  // Multer File Upload Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size exceeds the 5MB maximum limit per jewellery photograph.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { validateObjectId, notFoundHandler, globalErrorHandler };
