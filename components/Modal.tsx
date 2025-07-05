import { ReactNode } from 'react';

export function Modal({ children }: { children?: ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 z-98 h-full w-full bg-black opacity-80" />
      <div className="fixed top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%]">
        {children}
      </div>
    </>
  );
}
