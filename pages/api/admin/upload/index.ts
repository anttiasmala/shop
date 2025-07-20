import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { errors as FormidableErrors } from 'formidable';
import fs from 'fs';
import { checkIsAdminFromValidateRequest } from '~/backend/utils';
import { validateRequest } from '~/backend/auth/auth';
import { HttpError } from '~/backend/HttpError';
import { handleError } from '~/backend/handleError';
import { FormidableErrorCodes } from '~/shared/types';

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

    let UPLOAD_ERROR:
      | 'Invalid file type'
      | 'File exists in database already'
      | '';

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
          UPLOAD_ERROR = 'Invalid file type';
          return false;
        }

        try {
          const access = fs.accessSync(
            `${uploadFolderLocation}/${originalFilename}`,
          );

          // image is existing already, skip adding
          if (access === undefined) {
            UPLOAD_ERROR = 'File exists in database already';
            return false;
          }
          // eslint-disable-next-line
        } catch (e) {
          // throws an error if image was not found, we can add the image
          return true;
        }

        return false;
      },
    });
    // wrap form.parse to the Promise to avoid following warning:
    // API resolved without sending a response for /api/admin/upload, this may result in stalled requests.
    await new Promise<void>((resolve) => {
      form.parse(req, (e, _, files) => {
        if (e) {
          // Reference: https://github.com/node-formidable/formidable/issues/972#issuecomment-2442784495
          if (typeof e === 'object' && 'code' in e && 'httpCode' in e) {
            if (
              e.code === FormidableErrorCodes.biggerThanMaxFileSize ||
              e.code === FormidableErrorCodes.maxTotalFileSize
            ) {
              res.status(e.httpCode || 400).send('File was too large');
              return resolve();
            }
          }
          console.error('Error parsing form:', e);
          res.status(500).json({ error: 'File upload failed.' });
          resolve();
        }

        const uploadedFile = Object.keys(files).length > 0;
        console.log(uploadedFile);
        if (!uploadedFile) {
          if (UPLOAD_ERROR) {
            res.status(400).send(UPLOAD_ERROR);
            return resolve();
          }
          res.status(400).json({ error: 'File uploaded was invalid' });
          return resolve();
        }

        console.log('File uploaded successfully:', uploadedFile);
        res.status(200).end();
        resolve();
      });
    });
    //res.status(res.statusCode || 200).send()
  } catch (e) {
    console.error(e);
    return handleError(res, e);
  }
}
