import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Main } from '~/components/Main';
import { NavBarAdmin } from '~/components/NavBarAdmin';
import { QueryAndMutationKeys } from '~/shared/types';

import { getServerSidePropsAdminOnly as getServerSideProps } from '~/utils/getServerSideProps';
import { handleError } from '~/utils/handleError';

/* ADMINS ONLY */
export { getServerSideProps };

const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

export default function AdminIndex() {
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { mutateAsync, error } = useMutation({
    mutationKey: QueryAndMutationKeys.UploadImage,
    mutationFn: async () =>
      await axios.post('/api/admin/upload', inputRef.current?.files),
    onSuccess: () => {
      try {
        queryClient.clear();
        toast('Image uploaded succesfully!');
        const input = document.getElementById(
          'fileUploadInput',
        ) as HTMLInputElement;
        input.value = '';
        setFileName('');
      } catch (e) {
        console.error(e);
      }
    },
  });

  useEffect(() => {
    if (!error) return;
    handleError(error);
  }, [error]);

  async function handleSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      if (!inputRef.current?.files) {
        return;
      }
      if (
        ACCEPTED_FILE_TYPES.includes(inputRef.current.files[0].type) === false
      ) {
        toast('Invalid file given! Should be JPEG or PNG format');
        return;
      }
      console.log(inputRef.current.files[0].type);
      await mutateAsync();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Main>
      <NavBarAdmin />
      <p className="animate-[opacity_1200ms] text-center text-4xl font-bold">
        Upload images panel
      </p>
      <div className="mt-5 flex w-full justify-center">
        <form
          className="flex flex-col items-center"
          onSubmit={(e) => void handleSubmit(e)}
        >
          <label htmlFor="filename">Choose an image you want to upload</label>
          <input
            onChange={(e) => {
              e.preventDefault();
              console.log(e.target.files);
              if (e.target.files) {
                setFileName(e.target.files[0].name || '');
              }
            }}
            className="hidden"
            id="fileUploadInput"
            type="file"
            name="filename"
            ref={inputRef}
            accept="image/png, image/jpeg"
          />
          <p className="flex items-center">
            Selected file: {fileName || '-'}
            {fileName && (
              <span className="ml-4">
                <button
                  className="mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    try {
                      const input = document.getElementById(
                        'fileUploadInput',
                      ) as HTMLInputElement;
                      input.value = '';
                      setFileName('');
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <X className="size-7 text-red-500" />
                </button>
              </span>
            )}
          </p>

          {fileName ? (
            <button
              className="mt-3 w-48 rounded border bg-gray-300 p-2 hover:bg-gray-400"
              type="submit"
            >
              Submit File
            </button>
          ) : (
            <button
              className={`mt-3 w-48 rounded border bg-gray-300 p-2 hover:bg-gray-400 ${fileName ? 'hidden' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('fileUploadInput')?.click();
              }}
            >
              Select File
            </button>
          )}
        </form>
      </div>
    </Main>
  );
}
