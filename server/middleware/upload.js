const multer = require('multer');
const path = require('path');

// Store files locally on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // uploaded at the same millisecond will overwrite each other
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// Strictly allow PDF and standard images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  if (allowedMimeTypes.includes(mimeType) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter
});

module.exports = upload;

