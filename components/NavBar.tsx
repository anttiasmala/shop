import Link from 'next/link';
import { HTMLAttributes, Ref, useEffect, useRef, useState } from 'react';
import SvgMenu from '~/icons/menu';
import SvgStoreBag from '~/icons/store_bag';
import { twMerge } from 'tailwind-merge';
import axios, { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { GetCart, GetUser, QueryAndMutationKeys } from '~/shared/types';
import { UserCheck, UserX } from 'lucide-react';
import { isUserLoggedIn } from '~/utils/utils';
import { handleError } from '~/utils/handleError';
import { useEffectAfterInitialRender } from '~/hooks/useEffectAfterInitialRender';
import { cartSettingsSchema } from '~/shared/zodSchemas';

export function NavBar({
  user,
  productsFromParameter,
}: {
  user: GetUser;
  productsFromParameter?: GetCart[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [productAmount, setProductAmount] = useState(0);

  const authenticationModalRef = useRef<HTMLDivElement | null>(null);
  const isInitialClick = useRef<boolean>(true);

  const { data: products, error: getCartError } = useQuery({
    queryKey: [QueryAndMutationKeys.NavBarProducts, productsFromParameter],
    queryFn: async () => {
      // productsFromParameter is value given from anotherfile as an argument
      // for example in /pages/cart.tsx. This will make GET request to be sent only once
      if (productsFromParameter) return 0;
      const cartUUID = window.localStorage.getItem('cartUUID');
      return (await axios.get(`/api/cart/${cartUUID}`)).data as GetCart[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  useEffect(() => {
    // if cartUUID is invalid, create a new one
    if (!getCartError) return;
    if (getCartError instanceof AxiosError) {
      if (getCartError.response?.data === 'Cart was not found on the server!') {
        const randomUUID = crypto.randomUUID();
        window.localStorage.setItem('cartUUID', randomUUID);

        void axios.post(`/api/cart`, { cartUUID: randomUUID });
      }
    }
  }, [getCartError]);

  useEffect(() => {
    function runThis() {
      if (productsFromParameter) {
        let amountOfItems = 0;
        for (const item of productsFromParameter || []) {
          if (item.amount) {
            amountOfItems += item.amount;
          }
        }
        setProductAmount(amountOfItems);
        return;
      }

      let amountOfItems = 0;
      for (const item of products || []) {
        if (item.amount) {
          amountOfItems += item.amount;
        }
      }
      setProductAmount(amountOfItems);
    }
    runThis();
  }, [products, productsFromParameter]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // check if e.target is Element typed so it will have .contains function
      if (e.target instanceof Element) {
        const isClickInModal = authenticationModalRef.current?.contains(
          e.target,
        );

        if (isAuthModalOpen && !isClickInModal && !isInitialClick.current) {
          setIsAuthModalOpen((prevValue) => !prevValue);
        }
        // set initial click back to false, because initial click has been done
        if (isInitialClick.current) {
          isInitialClick.current = !isInitialClick.current;
        }
      }
    }
    // if modal is open add the EventListener
    if (isAuthModalOpen) {
      document.body.addEventListener('click', handleClick);
    }

    // remove the EventListener when modal is closed / unmounts
    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, [isAuthModalOpen]);

  useEffectAfterInitialRender(() => {
    async function runThis() {
      try {
        const cartSettings = window.localStorage.getItem('cartSettings');
        const cartUUID = window.localStorage.getItem('cartUUID');
        if (!cartSettings) return;
        // check here if JSON is parseable
        // perhaps make these into a separate functions?

        const cartSettingsParse = cartSettingsSchema.safeParse(
          JSON.parse(cartSettings),
        );
        if (!cartSettingsParse.success) {
          return;
        }
        if (
          cartSettingsParse.data.isLoggedIn &&
          !cartSettingsParse.data.isCartLinked
        ) {
          const cartLinkingRequest = await axios.post('/api/cart/link-cart', {
            cartUUID,
            userUUID: user.uuid,
          });
          window.localStorage.setItem(
            'cartSettings',
            JSON.stringify({
              isLoggedIn: true,
              isCartLinked: cartLinkingRequest.status === 200 ? true : false,
            }),
          );
        }
      } catch (e) {
        handleError(e);
      }
    }
    void runThis();
  }, []);

  const UserSVG = isUserLoggedIn(user) ? UserCheck : UserX;

  return (
    <div>
      <div className="flex h-16 w-full items-center justify-between bg-white shadow-lg">
        <Link
          href={'/'}
          className="ml-4 text-lg font-bold sm:ml-[15%] sm:text-xl"
        >
          MINIMONEY
        </Link>
        <div className="mr-3 flex">
          <button onClick={() => setIsMenuOpen((prevValue) => !prevValue)}>
            {isMenuOpen ? (
              <span className="text-3xl font-bold">X</span>
            ) : (
              <SvgMenu className="lg:hidden" width={30} height={30} />
            )}
          </button>
          <LinkElement
            href={'/'}
            className="mr-8 hidden hover:text-gray-600 lg:inline"
          >
            Home
          </LinkElement>
          <LinkElement href={'/products'} className="hidden lg:inline">
            Shop
          </LinkElement>
        </div>
        <div className="flex">
          <div>
            <button
              className="mr-6"
              onClick={() => {
                setIsAuthModalOpen((prevValue) => !prevValue);
                isInitialClick.current = true;
              }}
            >
              <UserSVG className="size-8" />
            </button>
            <AuthModal
              isAuthModalOpen={isAuthModalOpen}
              closeModal={() => setIsAuthModalOpen(false)}
              user={user}
              ref={authenticationModalRef}
            />
          </div>
          <Link href={'/cart'} className="relative mr-10 sm:mr-0">
            <span className="absolute top-1 left-0 flex rounded-full bg-red-500 p-1 pt-0 pb-0 text-xs text-white">
              <p>{productAmount}</p>
            </span>
            <SvgStoreBag width={40} height={40} className="" />
          </Link>
        </div>
      </div>
      <Menu isMenuOpen={isMenuOpen} />
    </div>
  );
}

function Menu({ isMenuOpen }: { isMenuOpen: boolean }) {
  if (!isMenuOpen) return null;
  return (
    <div className="h-24 w-full shadow-lg">
      <div className="w-full">
        <LinkElement href={'/'} className="block p-3">
          Home
        </LinkElement>
        <LinkElement href={'/products'} className="block p-3 pt-0">
          Shop
        </LinkElement>
      </div>
    </div>
  );
}

function LinkElement({
  href,
  className,
  children,
}: { href: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <Link className={twMerge('hover:text-gray-600', className)} href={href}>
      {children}
    </Link>
  );
}

function AuthModal({
  isAuthModalOpen,
  user,
  ref,
}: {
  closeModal: () => void;
  isAuthModalOpen: boolean;
  user: GetUser;
  ref?: Ref<HTMLDivElement>;
}) {
  if (!isAuthModalOpen) {
    return null;
  }

  if (isUserLoggedIn(user)) {
    // ref={ref}
    // is for modal closing check. If click is in modal, do nothing, else close modal
    return (
      <div
        className="absolute right-3 rounded border-black bg-gray-200 sm:right-auto"
        ref={ref}
      >
        <div className="h-full w-full">
          <p className="text-lg wrap-anywhere">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-lg wrap-anywhere">{user.email}</p>
          <div className="mt-4">
            <Link href={'/auth/logout'} className="button-54 hover:bg-gray-500">
              Log out
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute right-3 border-black bg-white sm:right-auto"
      ref={ref}
    >
      <div className="flex w-max flex-col">
        <Link href={'/auth/login'} className="button-54 hover:bg-gray-500">
          Login
        </Link>
        <Link
          href={'/auth/register'}
          className="button-54 mt-3 hover:bg-gray-500"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
