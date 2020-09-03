import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpPath = path.resolve(__dirname, '..', 'tmp');

export default {
  directory: tmpPath,
  storage: multer.diskStorage({
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
}
