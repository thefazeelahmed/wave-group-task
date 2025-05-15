/**
 * Image upload handler
 * 
 * TODO: 
 * - Add image compression
 * - Implement file cleanup for failed uploads
 * - Add support for multiple files
 * 
 * FIXME: Need to handle corrupt image files better
 */

const path = require('path');
const fs = require('fs').promises;

// Allowed mime types - extend as needed
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

// Max file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const handleUpload = async (req, res) => {
  const startTime = Date.now();

  try {
    // Log incoming request (but clean it up first)
    const cleanHeaders = { ...req.headers };
    delete cleanHeaders.cookie; // Don't log sensitive stuff
    delete cleanHeaders.authorization;

    console.log('📤 Upload request:', {
      ip: req.ip,
      headers: cleanHeaders,
      fileInfo: req.file ? {
        name: req.file.originalname,
        size: `${(req.file.size / 1024).toFixed(2)} KB`,
        type: req.file.mimetype
      } : 'No file'
    });

    // Basic validation
    if (!req.file) {
      throw new Error('NO_FILE');
    }

    // Double check file type (don't trust client-side validation)
    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
      // Clean up the file
      await fs.unlink(req.file.path).catch(err => {
        console.warn('Failed to delete invalid file:', err);
      });
      throw new Error('INVALID_TYPE');
    }

    // Extra size check (belt and suspenders)
    if (req.file.size > MAX_FILE_SIZE) {
      await fs.unlink(req.file.path).catch(err => {
        console.warn('Failed to delete oversized file:', err);
      });
      throw new Error('FILE_TOO_LARGE');
    }

    // All good! Log success
    console.log('Upload successful:', {
      file: req.file.filename,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      type: req.file.mimetype,
      timeMs: Date.now() - startTime
    });

    res.status(200).json({
      message: 'Upload successful! ',
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      type: req.file.mimetype,
      processedIn: `${Date.now() - startTime}ms`
    });

  } catch (err) {
    console.error('Upload failed:', err);

    const errorResponses = {
      'NO_FILE': {
        status: 400,
        message: 'No file uploaded',
        details: 'Make sure to include a file with your request'
      },
      'LIMIT_FILE_SIZE': {
        status: 413,
        message: 'File too large',
        details: `Max size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB`
      },
      'INVALID_TYPE': {
        status: 415,
        message: 'Invalid file type',
        details: `Supported types: ${ALLOWED_TYPES.join(', ')}`
      },
      'LIMIT_UNEXPECTED_FILE': {
        status: 400,
        message: 'Unexpected field name',
        details: 'Use "image" as the field name'
      }
    };

    const error = errorResponses[err.message || err.code] || {
      status: 500,
      message: 'Upload failed',
      details: 'Internal server error'
    };

    res.status(error.status).json({
      error: error.message,
      details: error.details,
      requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  }
};

module.exports = {
  handleUpload
};