import axios from 'axios';
import { Edit, EditIcon, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Input } from '~/components/Input';
import { NavBarAdmin } from '~/components/NavBarAdmin';

export default function ListImages() {
  const [images, setImages] = useState<string[]>([]);
  const [editModalData, setEditModalData] = useState('');
  const [deleteModalData, setDeleteModalData] = useState('');

  useEffect(() => {
    async function runThis() {
      const fetchedImages = await (await axios.get('/api/list-images')).data;
      setImages(fetchedImages);
    }

    void runThis();
  }, []);

  return (
    <main className="h-screen w-full bg-white">
      <div className="flex w-full justify-center">
        <div className="w-full sm:max-w-1/2">
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
        </div>
      </div>
    </main>
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

  function handleSubmit(e: FormEvent<HTMLElement>) {
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
      axios.put('/api/list-images', newAllImages);
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
          <form className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
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
      await axios.delete('/api/list-images', { data: imageName });
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
          <form className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
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
