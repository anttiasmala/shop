import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { checkIsAdminFromValidateRequest } from '~/backend/utils';
import { validateRequest } from '~/backend/auth/auth';
import { HttpError } from '~/backend/HttpError';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFolderLocation = './public/images/products';

export default async function UploadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const isAdmin = checkIsAdminFromValidateRequest(
      await validateRequest(req, res),
    );

    // user is not Admin, throw an error
    if (!isAdmin) {
      throw new HttpError("You don't have privileges to do that", 400);
    }

    const form = formidable({
      uploadDir: uploadFolderLocation,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5 MB
      filename(name, ext) {
        return `${name}${ext}`;
      },

      filter({ originalFilename, mimetype }) {
        console.log(originalFilename);
        const allowedMimeTypes = ['image/png', 'image/jpeg'];

        const isValidMimetype = allowedMimeTypes.includes(mimetype || '');

        if (!isValidMimetype) {
          console.warn(
            `Rejected file: ${originalFilename} with invalid MIME type: ${mimetype}`,
          );
          return false;
        }

        try {
          const access = fs.accessSync(
            `${uploadFolderLocation}/${originalFilename}`,
          );

          // image is existing already, skip adding
          if (access === undefined) {
            return false;
          }
          // eslint-disable-next-line
        } catch (e) {
          // throws and error if image was not found, we can add the image
          return true;
        }

        return false;
      },
    });

    form.parse(req, (err, _, files) => {
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
