// 현재 경로를 state로 관리하는 커스텀 훅
import { useEffect, useState } from 'react';
import { getCurrentPath } from './utils';

export const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(getCurrentPath());
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return currentPath;
};