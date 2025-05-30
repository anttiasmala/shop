import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MIME_TO_FILE = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
};

const uploadFolderLocation = './public/images/products';

export default async function UploadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const form = formidable({
      uploadDir: uploadFolderLocation,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5 MB
      filename(name, ext, part, form) {
        return `${name}${ext}`;
      },

      filter({ originalFilename, mimetype, name }) {
        console.log(originalFilename);
        const allowedMimeTypes = ['image/png', 'image/jpeg'];

        const isValidMimetype = allowedMimeTypes.includes(mimetype || '');

        if (!isValidMimetype) {
          console.warn(
            `Rejected file: ${originalFilename} with invalid MIME type: ${mimetype}`,
          );
          return false;
        }

        console.log(MIME_TO_FILE[mimetype as keyof typeof MIME_TO_FILE]);
        try {
          const access = fs.accessSync(
            `${uploadFolderLocation}/${originalFilename}`,
          );

          if (access === undefined) {
            console.log('Returning false');
            return false;
          }
        } catch (e) {
          return true;
        }

        return false;
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'File upload failed.' });
      }

      const uploadedFile = files.myFile;

      if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      console.log('File uploaded successfully:', uploadedFile);
    });

    res.status(200).end();
  } catch (e) {
    console.error(e);
  }
}
