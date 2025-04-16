import { uploads } from '../config/multerConfig';

export const backgroundImgUploads = uploads.fields([
  { name: 'backgroundImage', maxCount: 100 },
]);
