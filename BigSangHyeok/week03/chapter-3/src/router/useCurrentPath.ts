import { useEffect, useState } from 'react';
import { POPSTATE_EVENT, PUSHSTATE_EVENT } from './constants';
import { getCurrentPath } from './utils';

export const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(getCurrentPath());
    };

    window.addEventListener(PUSHSTATE_EVENT, handleRouteChange);
    window.addEventListener(POPSTATE_EVENT, handleRouteChange);

    return () => {
      window.removeEventListener(PUSHSTATE_EVENT, handleRouteChange);
      window.removeEventListener(POPSTATE_EVENT, handleRouteChange);
    };
  }, []);

  return currentPath;
};