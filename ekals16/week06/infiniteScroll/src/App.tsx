// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import InfinitePostsJsonPlaceholder from './components/InfinitePostsJsonPlaceholder';


// 1. QueryClient 인스턴스 생성
//    이 객체가 모든 쿼리 상태를 관리해요
const queryClient = new QueryClient();

const App = () => {
  return (
    // 2. Provider로 앱을 감싸기
    //    이제 하위 컴포넌트에서 React Query를 사용할 수 있어요
    <QueryClientProvider client={queryClient}>
      <InfinitePostsJsonPlaceholder />
      {/* 3. 개발 도구 추가 (개발 환경에서만 보여요) */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;
