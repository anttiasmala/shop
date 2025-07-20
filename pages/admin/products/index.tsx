import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { Pencil, ShoppingCart, Trash2 } from 'lucide-react';
import {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { Input } from '~/components/Input';
import { NavBarAdmin } from '~/components/NavBarAdmin';
import { AdminProduct, Product, QueryAndMutationKeys } from '~/shared/types';
import Image from 'next/image';

import { getServerSidePropsAdminOnly as getServerSideProps } from '~/utils/getServerSideProps';
import { Main } from '~/components/Main';
import { toast } from 'react-toastify';
import { BASE_IMAGE_URL } from '~/utils/constants';

/* ADMINS ONLY */
export { getServerSideProps };

export default function ProductsIndex() {
  const [editModalData, setEditModalData] = useState<Product | undefined>();
  const [deleteModalData, setDeleteModalData] = useState<Product | undefined>();
  const [deleteProductFromCartsModalData, setDeleteProductFromCartsModalData] =
    useState<Product | undefined>();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: listOfImages } = useQuery({
    queryKey: QueryAndMutationKeys.Images,
    queryFn: async () => {
      return (await axios.get(`/api/admin/list-images`)).data as string[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
  });

  useEffect(() => {
    console.log(listOfImages);
  }, [listOfImages]);

  return (
    <Main>
      <NavBarAdmin />
      <div className="flex w-full flex-col items-center">
        <p className="animate-[opacity_1200ms] text-4xl font-bold">
          Products panel
        </p>
        <div className="mt-5 flex flex-col items-center">
          <ProductTable
            setDeleteModalData={setDeleteModalData}
            setEditModalData={setEditModalData}
            setDeleteProductFromCartsModalData={
              setDeleteProductFromCartsModalData
            }
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
              listOfImages={listOfImages || []}
            />
          )}

          {deleteModalData && (
            <DeleteModal
              product={deleteModalData}
              closeModal={() => setDeleteModalData(undefined)}
              queryClient={queryClient}
            />
          )}

          {deleteProductFromCartsModalData && (
            <DeleteProductFromCarts
              product={deleteProductFromCartsModalData}
              closeModal={() => setDeleteProductFromCartsModalData(undefined)}
              queryClient={queryClient}
            />
          )}

          {isAddProductModalOpen && (
            <AddProduct
              closeModal={() => setIsAddProductModalOpen(false)}
              queryClient={queryClient}
              listOfImages={listOfImages || []}
            />
          )}
        </div>
      </div>
    </Main>
  );
}

function ProductTable({
  setDeleteModalData,
  setEditModalData,
  setDeleteProductFromCartsModalData,
}: {
  setEditModalData: Dispatch<SetStateAction<Product | undefined>>;
  setDeleteModalData: Dispatch<SetStateAction<Product | undefined>>;
  setDeleteProductFromCartsModalData: Dispatch<
    SetStateAction<Product | undefined>
  >;
}) {
  const [sortedProducts, setSortedProducts] = useState<AdminProduct[]>([]);

  const { data: products } = useQuery({
    queryKey: QueryAndMutationKeys.AdminProducts,
    queryFn: async () => {
      return (await axios.get(`/api/admin/products`)).data as AdminProduct[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  useEffect(() => {
    console.log(products);
    setSortedProducts(
      products
        ?.slice(0)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ) || [],
    );
    setSortedProducts(products || []);
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
        {sortedProducts?.map((_product, _index) => (
          <tr
            key={`product_${_index}`}
            className={`${_index % 2 == 0 ? 'bg-gray-200' : 'bg-gray-300'}`}
          >
            <Td>{_product.title}</Td>
            <Td>{_product.description}</Td>
            <Td>{_product.price}</Td>
            <Td>
              <Image
                priority={true}
                alt={_product.title}
                src={_product.image || BASE_IMAGE_URL}
                width={1920}
                height={1080}
                className="w-80 min-w-40 rounded-md object-contain"
              />
            </Td>
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
                <button
                  className="m-2 border border-gray-500 p-2 hover:bg-gray-500"
                  onClick={() => setDeleteProductFromCartsModalData(_product)}
                >
                  <ShoppingCart />
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
  listOfImages,
}: {
  product: Product;
  closeModal: () => void;
  queryClient: QueryClient;
  listOfImages: string[];
}) {
  const [showSelectModal, setShowSelectModal] = useState(false);
  const { category, description, image, price, title } = product;
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
      await axios.patch(`/api/admin/products/${product.id}`, inputFields),
    onSuccess: async () => {
      try {
        closeModal();
        await queryClient.invalidateQueries({
          queryKey: QueryAndMutationKeys.AdminProducts,
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
            <button
              type="button"
              className="mb-3 rounded border border-white text-white hover:bg-blue-500"
              onClick={() => setShowSelectModal((prevValue) => !prevValue)}
            >
              Choose Image
            </button>
            <p className="mt-3 max-w-48 wrap-anywhere text-white">
              {inputFields.image || ''}
            </p>
            {showSelectModal && (
              <div className="h-64 w-56 overflow-auto bg-white">
                {listOfImages.map((_image, _index) => (
                  <button
                    key={`${_image}_${_index}`}
                    className="border-black p-4 hover:border-4"
                    type="button"
                    onClick={() => {
                      setInputFields((prevValue) => ({
                        ...prevValue,
                        image: `/images/products/${_image}`,
                      }));
                      setShowSelectModal(false);
                    }}
                  >
                    <Image
                      alt="productImage"
                      src={`/images/products/${_image}`}
                      width={1920}
                      height={1080}
                      className="w-32"
                    />
                  </button>
                ))}
              </div>
            )}
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
  const { mutateAsync, error } = useMutation({
    mutationKey: ['deleteProductMutationKey'],
    mutationFn: () => axios.delete(`/api/admin/products/${product.id}`),
    onSuccess: async () => {
      try {
        closeModal();
        await queryClient.invalidateQueries({
          queryKey: QueryAndMutationKeys.AdminProducts,
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  useEffect(() => {
    if (!error) return;
    console.error(error);
    toast(
      'Product is most likely added to cart, so Foreign key constraint is violated. Use Cart icon in Actions to delete the product from carts',
    );
    closeModal();
  }, [error, closeModal]);

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

function DeleteProductFromCarts({
  closeModal,
  product,
  queryClient,
}: {
  product: Product;
  closeModal: () => void;
  queryClient: QueryClient;
}) {
  const { mutateAsync, error } = useMutation({
    mutationKey: ['deleteProductFromCartsMutationKey'],
    mutationFn: () =>
      axios.post(`/api/admin/clear-product-from-carts`, {
        productId: product.id,
      }),
    onSuccess: async () => {
      try {
        closeModal();
        await queryClient.invalidateQueries({
          queryKey: QueryAndMutationKeys.AdminProducts,
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  useEffect(() => {
    if (!error) return;
    console.error(error);
  }, [error]);

  return (
    <div>
      <div className="fixed top-0 left-0 z-98 h-full w-full bg-black opacity-80" />
      <div className="fixed top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%]">
        <div className="flex flex-col rounded bg-black">
          <label className="text-white">
            Delete the following product{' '}
            <span className="text-2xl font-bold">{product.title}</span> from all
            of the users&apos; cart?
          </label>
          <p className="text-sm text-white">
            This is used to clear specific product from carts so the product can
            be deleted from the database
          </p>
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
  listOfImages,
}: {
  closeModal: () => void;
  queryClient: QueryClient;
  listOfImages: string[];
}) {
  const [showSelectModal, setShowSelectModal] = useState(false);

  const [inputFields, setInputFields] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });

  const { mutateAsync } = useMutation({
    mutationKey: ['addProductMutationKey'],
    mutationFn: () => axios.post('/api/admin/products', inputFields),
    onSuccess: async () => {
      try {
        closeModal();
        await queryClient.invalidateQueries({
          queryKey: QueryAndMutationKeys.AdminProducts,
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
            <button
              type="button"
              className="mb-3 text-white"
              onClick={() => setShowSelectModal((prevValue) => !prevValue)}
            >
              Choose Image
            </button>
            <p className="mt-3 max-w-48 wrap-anywhere text-white">
              {inputFields.image || ''}
            </p>
            {showSelectModal && (
              <div className="h-64 w-56 overflow-auto bg-white">
                {listOfImages.map((_image, _index) => (
                  <button
                    key={`${_image}_${_index}`}
                    className="p-4"
                    type="button"
                    onClick={() => {
                      setInputFields((prevValue) => ({
                        ...prevValue,
                        image: `/images/products/${_image}`,
                      }));
                      setShowSelectModal(false);
                    }}
                  >
                    <Image
                      alt="productImage"
                      src={`/images/products/${_image}`}
                      width={1920}
                      height={1080}
                      className="w-32"
                    />
                  </button>
                ))}
              </div>
            )}
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
