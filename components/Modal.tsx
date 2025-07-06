import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { useKeyPress } from '~/hooks/useKeyPress';

export function Modal({
  children,
  firstDivClassName,
  secondDivClassName,
  closeModal,
}: {
  children?: ReactNode;
  firstDivClassName?: string;
  secondDivClassName?: string;
  closeModal: () => void;
}) {
  useKeyPress('Escape', closeModal);

  return (
    <>
      <div
        className={twMerge(
          'fixed top-0 left-0 z-98 h-full w-full bg-black opacity-80',
          firstDivClassName,
        )}
      />
      <div
        className={twMerge(
          'fixed top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%]',
          secondDivClassName,
        )}
      >
        {children}
      </div>
    </>
  );
}
