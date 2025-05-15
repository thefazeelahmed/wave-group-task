const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute path relative to this file
    const uploadPath = path.join(__dirname, '../../upload_images');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      console.log('Creating upload directory:', uploadPath);
      try {
        fs.mkdirSync(uploadPath, { recursive: true });
      } catch (error) {
        console.error('Failed to create upload directory:', error);
        return cb(error);
      }
    }

    // Check if directory is writable
    try {
      fs.accessSync(uploadPath, fs.constants.W_OK);
    } catch (error) {
      console.error('Upload directory is not writable:', error);
      return cb(error);
    }

    console.log('Using upload path:', uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename while preserving extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  console.log('Received file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });

  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1, // Maximum 1 file per request
  },
});

module.exports = upload;
