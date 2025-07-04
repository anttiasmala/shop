import axios from 'axios';
import { EditIcon, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { Input } from '~/components/Input';
import { Main } from '~/components/Main';
import { NavBarAdmin } from '~/components/NavBarAdmin';
import { getServerSidePropsAdminOnly as getServerSideProps } from '~/utils/getServerSideProps';

/* ADMINS ONLY */
export { getServerSideProps };

export default function ListImages() {
  const [images, setImages] = useState<string[]>([]);
  const [editModalData, setEditModalData] = useState('');
  const [deleteModalData, setDeleteModalData] = useState('');

  useEffect(() => {
    async function runThis() {
      const fetchedImages = (await (
        await axios.get('/api/admin/list-images')
      ).data) as string[];
      setImages(fetchedImages);
    }

    void runThis();
  }, []);

  return (
    <Main>
      <NavBarAdmin />
      <p className="mt-3 animate-[opacity_1200ms] text-center text-4xl font-bold">
        List Images
      </p>
      <div className="mt-5 flex w-full flex-wrap">
        {images.map((_image, _index) => {
          return (
            <div
              key={`imageDiv_${_index}`}
              className="flex w-96 flex-col items-center border"
            >
              <Image
                priority={true}
                alt="image"
                src={`/images/products/${_image}`}
                width={1920}
                height={1080}
                className="size-48"
              />
              <p className="wrap-anywhere">{_image}</p>
              <div>
                <button
                  className="mr-4 hover:bg-gray-400"
                  onClick={() => setEditModalData(_image)}
                >
                  <EditIcon />
                </button>
                <button
                  className="hover:bg-gray-400"
                  onClick={() => setDeleteModalData(_image)}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {editModalData && (
        <EditModal
          closeModal={() => setEditModalData('')}
          imageName={editModalData}
          allImages={images}
        />
      )}
      {deleteModalData && (
        <DeleteModal
          closeModal={() => setDeleteModalData('')}
          imageName={deleteModalData}
        />
      )}
    </Main>
  );
}

function EditModal({
  imageName,
  closeModal,
  allImages,
}: {
  imageName: string;
  closeModal: () => void;
  allImages: string[];
}) {
  const [newImageName, setNewImageName] = useState(imageName);

  const oldImageName = imageName;

  async function handleSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      console.log('Submit');
      console.log(allImages);
      const filteredImages = allImages.filter(
        (value) => value !== oldImageName,
      );
      console.log(oldImageName, newImageName);
      const newAllImages = [...filteredImages, newImageName];
      console.log(newAllImages);
      await axios.put('/api/admin/list-images', newAllImages);
      closeModal();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="fixed inset-0 h-full w-full bg-black/90">
      <div className="fixed top-1/2 left-4 sm:left-1/2">
        <button
          className="absolute -top-4 right-0 text-white hover:border"
          onClick={() => closeModal()}
        >
          <X className="size-8" />
        </button>
        <div>
          <form
            className="flex flex-col"
            onSubmit={(e) => void handleSubmit(e)}
          >
            <label className="text-white">Image Name:</label>
            <Input
              className="w-72"
              value={newImageName}
              onChange={(e) => setNewImageName(e.target.value)}
            />
            <div className="mt-4 flex w-full justify-center">
              <button
                className="mr-4 w-20 rounded-lg border text-white hover:bg-gray-500"
                type="button"
                onClick={() => closeModal()}
              >
                Cancel
              </button>
              <button
                className="w-20 rounded-lg border text-white hover:bg-gray-500"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({
  imageName,
  closeModal,
}: {
  imageName: string;
  closeModal: () => void;
}) {
  async function handleSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      console.log('Submit');
      await axios.delete('/api/admin/list-images', { data: imageName });
      closeModal();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="fixed inset-0 h-full w-full bg-black/90">
      <div className="fixed top-1/2 left-4 sm:left-1/2">
        <button
          className="absolute -top-16 right-0 text-white hover:border"
          onClick={() => closeModal()}
        >
          <X className="size-8" />
        </button>
        <div>
          <form
            className="flex flex-col"
            onSubmit={(e) => void handleSubmit(e)}
          >
            <p className="text-white">
              Delete image{' '}
              <span className="text-lg font-bold">{imageName}</span>?
            </p>
            <div className="mt-4 flex w-full justify-center">
              <button
                className="mr-4 w-20 rounded-lg border text-white hover:bg-gray-500"
                type="button"
                onClick={() => closeModal()}
              >
                Cancel
              </button>
              <button
                className="w-20 rounded-lg border text-white hover:bg-gray-500"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
