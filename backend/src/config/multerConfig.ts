import path from 'path';
import multer from 'multer';
import { randomInt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const paths = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, paths);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${randomInt(1, 256)}_${uuidv4()}`); //datenow is used to prevent overriding of file
  },
});

export const uploads = multer({ storage });
