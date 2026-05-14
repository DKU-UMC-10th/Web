import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. TanStack Query 엔진과 개발 도구 불러오기 🥊
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// 2. 쿼리 클라이언트 인스턴스 생성
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 3. Provider로 앱 전체를 감싸기 ㅡㅡ */}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* 개발할 때 데이터 흐름을 보여주는 도구 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)