import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // 👈 레이아웃 컴포넌트 (헤더, 사이드바 포함)
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import MyPage from './pages/MyPage'; 
import LpListPage from './pages/LpListPage'; // 👈 신규: LP 목록 페이지
import LpDetailPage from './pages/LpDetailPage'; // 👈 신규: LP 상세 페이지

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 로그인, 회원가입은 레이아웃 없이 단독 노출 ㅡㅡ */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 메인 서비스 영역: 레이아웃으로 감싸기 🥊 */}
          <Route element={<Layout />}>
            {/* 기본 경로를 LP 목록으로 변경 🍠 */}
            <Route path="/" element={<Navigate to="/lps" replace />} />
            <Route path="/lps" element={<LpListPage />} />
            
            {/* 상세 페이지는 보호 라우트로 감싸거나 내부에서 처리 ㅡㅡ */}
            <Route element={<ProtectedRoute />}>
              <Route path="/lp/:lpid" element={<LpDetailPage />} />
              <Route path="/mypage" element={<MyPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;