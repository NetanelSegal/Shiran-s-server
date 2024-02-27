const multer = require("multer");
const path = require("path");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});


// Create the multer instance
exports.upload = multer({
  storage: storage, limits: { fieldSize: 1024 * 1000 * 5 },
  fileFilter: (req, file, cb) => {
    const allowedExt = [/jpg/, /png/, /jpeg/]

    if (!allowedExt.some((regExp) => regExp.test(path.extname(file.originalname))
    )) {
      cb(new Error('File type is not allowed'))
    }

    cb(null, true)
  }
});