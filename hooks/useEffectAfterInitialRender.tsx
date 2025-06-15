import { useRef, DependencyList, useEffect } from 'react';

export function useEffectAfterInitialRender<T extends DependencyList>(
  callback: () => void,
  dependencies: T,
) {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    callback();
  }, dependencies);
}
