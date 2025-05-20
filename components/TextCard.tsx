import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function TextCard({
  children,
  className,
  parentDivClassName,
}: HTMLAttributes<HTMLDivElement> & { parentDivClassName?: string }) {
  return (
    <div className={parentDivClassName}>
      <div className={twMerge('bg-white', className)}>{children}</div>
    </div>
  );
}
