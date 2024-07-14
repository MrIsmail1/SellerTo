import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("files", 10); // Allow up to 10 files

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Seule les images sont autorisées!"));
  }
}

// Service function to handle file uploads
export const uploadFiles = (req, res, callback) => {
  upload(req, res, (err) => {
    if (err) {
      callback(err, null);
    } else {
      if (req.files == undefined) {
        callback(new Error("Pas de fichier selectionner..."), null);
      } else {
        const fileInfos = req.files.map((file) => ({
          originalname: file.originalname,
          filename: file.filename,
          size: file.size,
          path: `/uploads/${file.filename}`,
          mimetype: file.mimetype,
        }));
        callback(null, fileInfos);
      }
    }
  });
};
