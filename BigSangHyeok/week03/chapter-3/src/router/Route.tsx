import {
  Children,
  cloneElement,
  isValidElement,
  useMemo,
  type ReactElement,
} from 'react';
import { useCurrentPath } from './useCurrentPath';
import type { RouteProps, RoutesProps } from './types';

const isRouteElement = (
  element: unknown,
): element is ReactElement<RouteProps> => {
  return isValidElement(element) && 'path' in element.props;
};

export const Routes = ({ children }: RoutesProps) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return <h1>404</h1>;

  return cloneElement(activeRoute);
};