import type { ComponentType, PropsWithChildren, ReactElement } from 'react';

export type LinkProps = PropsWithChildren<{
  to: string;
}>;

export type RouteProps = {
  path: string;
  component: ComponentType;
};

export type RoutesProps = PropsWithChildren;

export type RouteElement = ReactElement<RouteProps>;