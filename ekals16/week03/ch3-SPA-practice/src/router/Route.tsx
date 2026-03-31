import type { RouteProps } from './types';
// Route.tsx
export const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};
// props의 component를 꺼내서 Component라는 이름으로 사용
// Route 컴포넌트는 component prop으로 받은 컴포넌트를 렌더링하는 역할을 함
// 예를 들어, <Route path='/matthew' component={MatthewPage} /> 라고 하면, Route 컴포넌트는 MatthewPage 컴포넌트를 렌더링하게 됨