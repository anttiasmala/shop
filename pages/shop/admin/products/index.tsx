import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { Input } from '~/components/Input';
import { Product, QueryAndMutationKeys } from '~/shared/types';
import { useGetProducts } from '~/utils/apiRequests';

export default function ProductsIndex() {
  const [editModalData, setEditModalData] = useState<Product | undefined>();
  const [deleteModalData, setDeleteModalData] = useState<Product | undefined>();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const queryClient = useQueryClient();

  return (
    <main className="h-screen w-full bg-white">
      <div className="w-full">
        <div className="flex w-full flex-col items-center">
          <p className="animate-[opacity_1200ms] text-center">Products panel</p>
          <div className="mt-5 flex flex-col items-center">
            <ProductTable
              setDeleteModalData={setDeleteModalData}
              setEditModalData={setEditModalData}
            />
            <button
              className="mt-4 rounded-md bg-black p-2 text-white"
              onClick={() => setIsAddProductModalOpen(true)}
            >
              Add Product
            </button>

            {editModalData && (
              <EditModal
                product={editModalData}
                closeModal={() => setEditModalData(undefined)}
                queryClient={queryClient}
              />
            )}

            {deleteModalData && (
              <DeleteModal
                product={deleteModalData}
                closeModal={() => setDeleteModalData(undefined)}
                queryClient={queryClient}
              />
            )}

            {isAddProductModalOpen && (
              <AddProduct
                closeModal={() => setIsAddProductModalOpen(false)}
                queryClient={queryClient}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ProductTable({
  setDeleteModalData,
  setEditModalData,
}: {
  setEditModalData: Dispatch<SetStateAction<Product | undefined>>;
  setDeleteModalData: Dispatch<SetStateAction<Product | undefined>>;
}) {
  const { data: products } = useGetProducts();

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <table className="block w-56 overflow-auto overflow-y-auto sm:w-96 lg:w-10/12">
      <thead>
        <tr className="">
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Image</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody className="border-4 border-black">
        {products?.map((_product, _index) => (
          <tr
            key={`product_${_index}`}
            className={` ${_index % 2 == 0 ? 'bg-gray-200' : 'bg-gray-300'}`}
          >
            <Td>{_product.title}</Td>
            <Td>{_product.description}</Td>
            <Td>{_product.price}</Td>
            <Td>{_product.image}</Td>
            <Td>{_product.category}</Td>
            <Td>
              <div className="flex">
                <button
                  className="m-2 border border-gray-500 p-2 hover:bg-gray-500"
                  onClick={() => setEditModalData(_product)}
                >
                  <Pencil />
                </button>
                <button
                  className="m-2 border border-gray-500 p-2 hover:bg-gray-500"
                  onClick={() => setDeleteModalData(_product)}
                >
                  <Trash2 />
                </button>
              </div>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Td({ children, className }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={twMerge(`border border-black p-6`, className)}>
      {children}
    </td>
  );
}

function EditModal({
  product,
  closeModal,
  queryClient,
}: {
  product: Product;
  closeModal: () => void;
  queryClient: QueryClient;
}) {
  const { category, description, id, image, price, title } = product;
  const [inputFields, setInputFields] = useState({
    title: title,
    description: description,
    price: price,
    image: image,
    category: category,
  });

  const { mutateAsync } = useMutation({
    mutationKey: ['editProductMutationKey'],
    mutationFn: async () =>
      await axios.patch(`/api/products/${product.id}`, inputFields),
    onSuccess: async () => {
      try {
        closeModal();
        await queryClient.invalidateQueries({
          queryKey: QueryAndMutationKeys.Products,
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  return (
    <div>
      <div className="fixed top-0 left-0 z-98 h-full w-full bg-black opacity-80" />
      <div className="fixed top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              mutateAsync();
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <div className="flex flex-col">
            <label className="text-white">Title:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  title: e.target.value,
                }))
              }
              value={inputFields.title}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Description:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  description: e.target.value,
                }))
              }
              value={inputFields.description}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Price:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  price: e.target.value,
                }))
              }
              value={inputFields.price}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Image:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  image: e.target.value,
                }))
              }
              value={inputFields.image}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Category:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  category: e.target.value,
                }))
              }
              value={inputFields.category}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="mt-4 mr-4 bg-blue-500 p-2 text-white"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button className="mt-4 ml-4 bg-blue-500 p-2 text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({
  closeModal,
  product,
  queryClient,
}: {
  product: Product;
  closeModal: () => void;
  queryClient: QueryClient;
}) {
  const { mutateAsync } = useMutation({
    mutationKey: ['deleteProductMutationKey'],
    mutationFn: () => axios.delete(`/api/products/${product.id}`),
    onSuccess: async () => {
      try {
        closeModal();
        await queryClient.invalidateQueries({
          queryKey: QueryAndMutationKeys.Products,
        });
      } catch (e) {
        console.error(e);
      }
    },
  });
  return (
    <div>
      <div className="fixed top-0 left-0 z-98 h-full w-full bg-black opacity-80" />
      <div className="fixed top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%]">
        <div className="flex flex-col">
          <label className="text-white">
            Delete <span className="font-bold">{product.title}</span>?
          </label>
        </div>

        <div className="flex justify-center">
          <button
            className="mt-4 mr-4 bg-blue-500 p-2 text-white"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="mt-4 ml-4 bg-blue-500 p-2 text-white"
            onClick={() => {
              try {
                void mutateAsync();
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 *
 * **TODO:**
 *
 * Add a check so any of the fields cannot be empty
 */
function AddProduct({
  closeModal,
  queryClient,
}: {
  closeModal: () => void;
  queryClient: QueryClient;
}) {
  const [inputFields, setInputFields] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });

  const { mutateAsync } = useMutation({
    mutationKey: ['addProductMutationKey'],
    mutationFn: () => axios.post('/api/products', inputFields),
    onSuccess: async () => {
      try {
        closeModal();
        await queryClient.invalidateQueries({
          queryKey: QueryAndMutationKeys.Products,
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  return (
    <div>
      <div className="fixed top-0 left-0 z-98 h-full w-full bg-black opacity-80" />
      <div className="fixed top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              void mutateAsync();
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <div className="flex flex-col">
            <label className="text-white">Title:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  title: e.target.value,
                }))
              }
              value={inputFields.title}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Description:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  description: e.target.value,
                }))
              }
              value={inputFields.description}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Price:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  price: e.target.value,
                }))
              }
              value={inputFields.price}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Image:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  image: e.target.value,
                }))
              }
              value={inputFields.image}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Category:</label>
            <Input
              onChange={(e) =>
                setInputFields((prevValue) => ({
                  ...prevValue,
                  category: e.target.value,
                }))
              }
              value={inputFields.category}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="mt-4 mr-4 bg-blue-500 p-2 text-white"
              onClick={closeModal}
              type="button"
            >
              Cancel
            </button>
            <button
              className="mt-4 ml-4 bg-blue-500 p-2 text-white"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
