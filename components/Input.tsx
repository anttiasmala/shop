import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge(
        `rounded-md border border-black bg-gray-200 pt-3 pb-3 pl-2`,
        className,
      )}
      {...rest}
    />
  );
}
