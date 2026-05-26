import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import './App.css'
import HomeLayout from './layouts/HomeLayout'
import ProtectedLayout from './layouts/ProtectedLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Mypage from './pages/Mypage'
import { AuthProvider } from './context/AuthContext'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage'
import LpDetailPage from './pages/LpDetailPage.tsx'
import LpNewPage from './pages/LpNewPage.tsx'
import { queryClient } from "./queryClient.ts";

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

// publicRoutes : 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <HomePage />},
      {path: "lp/new", element: <LpNewPage />},
      {path: "login", element: <LoginPage />},
      {path: "signup", element: <SignupPage />},
      {path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage />},
      {
        element: <ProtectedLayout />,
        children: [
          {path: "lp/:lpid", element: <LpDetailPage />},
          {path: "my", element: <Mypage />},
        ],
      },
    ]
  }
];

// protectedRoutes : 인증이 필요한 라우트
const router = createBrowserRouter([
  ...publicRoutes,
])

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App
