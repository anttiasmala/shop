import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function Main({
  mainClassName,
  firstDivClassName,
  secondDivClassName,
  children,
}: {
  mainClassName?: string;
  firstDivClassName?: string;
  secondDivClassName?: string;
  children: ReactNode;
}) {
  return (
    <main className={twMerge('h-screen w-full bg-white', mainClassName)}>
      <div className={twMerge('flex w-full justify-center', firstDivClassName)}>
        <div className={twMerge('w-full md:max-w-1/2', secondDivClassName)}>
          {children}
        </div>
      </div>
    </main>
  );
}
