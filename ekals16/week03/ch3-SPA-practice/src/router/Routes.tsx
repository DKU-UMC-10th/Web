// Router.tsx
import {
  Children,
  cloneElement,
  isValidElement,
  useMemo,
  type FC,
} from 'react';
import { useCurrentPath } from './hooks';
import type { RouteElement, RouteProps, RoutesProps } from './types';

const isRouteElement = (child: unknown): child is RouteElement => {
  return isValidElement(child) && 'path' in (child.props as RouteProps);
};

// Router.tsx
export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;

  return cloneElement(activeRoute);
};