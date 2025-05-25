import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Container({
  children,
  className,
  parentDivClassName,
}: HTMLAttributes<HTMLDivElement> & {
  parentDivClassName?: string;
}) {
  return (
    <div className={parentDivClassName}>
      <div
        className={twMerge(
          'mr-5 ml-5 flex justify-center rounded bg-gray-50',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
