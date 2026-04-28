import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RootLayout from './layout/RootLayout'; // 지오님의 레이아웃 경로
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';

// 1. 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      
      // 👇 미션 1의 핵심: 보호된 경로
      {
        element: <ProtectedRoute />,
        children: [
          { path: "mypage", element: <MyPage /> },
          // 여기에 토큰이 필요한 다른 페이지들을 추가하세요!
        ],
      },
    ],
  },
]);

function App() {
  return (
    // 2. 전역 상태 관리를 위해 AuthProvider로 감싸줍니다.
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;