// Import multer
const multer = require("multer");

// Define storage as memory
const storage = multer.memoryStorage();

// Define file filter function
const fileFilter = (req, file, cb) => {
  // Check if the file is an image
  if (file.mimetype.startsWith("image/")) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file with an error message
    cb(new Error("Only images are allowed"), false);
  }
};

// Define upload middleware with options
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB in bytes
  },
  fileFilter: fileFilter,
});

module.exports = upload;
