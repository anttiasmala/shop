import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { EditIcon, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { Input } from '~/components/Input';
import { Main } from '~/components/Main';
import { Modal } from '~/components/Modal';
import { NavBarAdmin } from '~/components/NavBarAdmin';
import { QueryAndMutationKeys } from '~/shared/types';
import { BASE_IMAGE_URL } from '~/utils/constants';
import { getServerSidePropsAdminOnly as getServerSideProps } from '~/utils/getServerSideProps';

/* ADMINS ONLY */
export { getServerSideProps };

export default function ListImages() {
  const [images, setImages] = useState<string[]>([]);
  const [editModalData, setEditModalData] = useState('');
  const [deleteModalData, setDeleteModalData] = useState('');
  const [zoomedImageModalData, setZoomedImageModalData] = useState('');

  const queryClient = useQueryClient();

  const { data: fetchedImages, refetch } = useQuery({
    queryKey: QueryAndMutationKeys.ListImages,
    queryFn: async () => {
      return (await axios.get('/api/admin/list-images')).data as string[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  useEffect(() => {
    async function runThis() {
      await refetch();
      setImages(fetchedImages || []);
    }

    void runThis();
  }, [fetchedImages, refetch]);

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
              className="flex w-full flex-col items-center border sm:w-72"
            >
              <button
                onClick={() =>
                  setZoomedImageModalData(`/images/products/${_image}`)
                }
              >
                <Image
                  priority={true}
                  alt="image"
                  src={`/images/products/${_image}`}
                  width={1920}
                  height={1080}
                  className="size-48 object-contain"
                />
              </button>
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
          queryClient={queryClient}
        />
      )}
      {deleteModalData && (
        <DeleteModal
          closeModal={() => setDeleteModalData('')}
          imageName={deleteModalData}
          queryClient={queryClient}
        />
      )}
      {zoomedImageModalData && (
        <ZoomImageModal
          closeModal={() => setZoomedImageModalData('')}
          imageHref={zoomedImageModalData}
        />
      )}
    </Main>
  );
}

function EditModal({
  imageName,
  closeModal,
  allImages,
  queryClient,
}: {
  imageName: string;
  closeModal: () => void;
  allImages: string[];
  queryClient: QueryClient;
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
      await queryClient.invalidateQueries({
        queryKey: QueryAndMutationKeys.ListImages,
      });
      closeModal();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Modal closeModal={() => closeModal()} firstDivClassName="opacity-90">
      <button
        className="absolute -top-4 right-0 text-white hover:border"
        onClick={() => closeModal()}
      >
        <X className="size-8" />
      </button>
      <div>
        <form className="flex flex-col" onSubmit={(e) => void handleSubmit(e)}>
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
    </Modal>
  );
}

function DeleteModal({
  imageName,
  closeModal,
  queryClient,
}: {
  imageName: string;
  closeModal: () => void;
  queryClient: QueryClient;
}) {
  async function handleSubmit(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      console.log('Submit');
      await axios.delete('/api/admin/list-images', { data: imageName });
      await queryClient.invalidateQueries({
        queryKey: QueryAndMutationKeys.ListImages,
      });
      closeModal();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Modal closeModal={() => closeModal()} firstDivClassName="opacity-90">
      <button
        className="absolute -top-16 right-0 text-white hover:border"
        onClick={() => closeModal()}
      >
        <X className="size-8" />
      </button>
      <div>
        <form className="flex flex-col" onSubmit={(e) => void handleSubmit(e)}>
          <p className="text-white">
            Delete image <span className="text-lg font-bold">{imageName}</span>?
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
    </Modal>
  );
}

function ZoomImageModal({
  closeModal,
  imageHref,
}: {
  closeModal: () => void;
  imageHref: string;
}) {
  /* Starting at row 260 is kinda of a workaround. Check if it really works */
  return (
    <Modal closeModal={() => closeModal()}>
      <div className="absolute -top-24 -right-7 z-10">
        <button type="button" onClick={() => closeModal()}>
          <X className="size-24 text-white" />
        </button>
      </div>
      <div className="overflow-auto sm:h-[52rem]">
        <a href={imageHref || BASE_IMAGE_URL} target="_blank" className="">
          <Image
            priority={true}
            alt="SSD"
            src={imageHref || BASE_IMAGE_URL}
            blurDataURL="/images/products/image_base.png"
            className="object-contain"
            width={1920}
            height={1080}
          />
        </a>
      </div>
    </Modal>
  );
}
