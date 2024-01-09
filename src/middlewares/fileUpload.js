import multer from "multer";
import fs from "fs";

const fileUpload = (uploadDirectory) => {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      const parts = file.originalname.split(".");
      let extenson;
      if (parts.length > 1) {
        extenson = "." + parts.pop();
      }
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, parts.shift() + "-" + uniqueSuffix + extenson);
    },
  });
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 2000000,
    },

    fileFilter: function (req, file, cb) {
      console.log(file);
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/svg" ||
        file.mimetype === "image/svg+xml"
      ) {
        cb(null, true);
      } else {
        cb(new Error("only png,jpg,jpeg,svg format allowed"), false);
      }
    },
  });
  return upload;
};
export default fileUpload;
