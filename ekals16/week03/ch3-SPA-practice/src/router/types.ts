import type { ComponentType, MouseEventHandler, ReactElement, ReactNode } from 'react';

export interface LinkProps {
  to: string;
  children: ReactNode;
}

export interface RouteProps {
  path: string;
  component: ComponentType;
}

export interface RoutesProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export type RouteElement = ReactElement<RouteProps>;

export type AnchorClickHandler = MouseEventHandler<HTMLAnchorElement>;