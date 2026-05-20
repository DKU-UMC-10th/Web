import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';


// 1. TanStack Query 도구들 불러오기 🥊
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// 2. 환경 변수에서 클라이언트 ID 가져오기
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 3. 쿼리 클라이언트 생성
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 4. 두 개의 Provider로 App을 겹겹이 감싸줍니다 ㅡㅡ */}
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
      {/* 개발 도구도 잊지 말고 넣어주세요! 🍠 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)