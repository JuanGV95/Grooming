import { __dirname } from "./utils.js";
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let folder;
      if (file.fieldname === 'profileImage') {
        folder = 'profiles';
      } else if (file.fieldname === 'productImage') {
        folder = 'products';
      } else {
        folder = 'documents';
      }
      cb(null, `${__dirname}/../public/${folder}`);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({ storage });

  export default upload;