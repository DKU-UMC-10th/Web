// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 👈 꼭 감싸줘야 함!
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; // 👈 import 확인!
import MyPage from './pages/MyPage'; 

function App() {
  return (
    <AuthProvider> {/* 👈 이게 있어야 isLoggedIn 정보를 읽어옵니다 */}
      <BrowserRouter>
        <Routes>
          {/* 1. 누구나 갈 수 있는 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* 기본 경로 접속 시 로그인으로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 2. 로그인한 사람만 갈 수 있는 페이지 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;