const multer = require("multer");
const fs = require("fs");
const path=require("path");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const uploadFolder = "./profileImages";

      // Ensure the directory exists
`      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }`

      // Attach folder path for later use
      req.uploadFolder = uploadFolder;
      cb(null, uploadFolder);
    } catch (err) {
      cb(err, null); // Pass error to multer
    }
  },

  filename: function (req, file, cb) {
    try {
      const ext = path.extname(file.originalname); // Get file extension
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
      cb(null, fileName);
    } catch (err) {
      cb(err, null); // Pass error to multer
    }
  },
});


const upload = multer({ storage:storage });
module.exports={upload}
