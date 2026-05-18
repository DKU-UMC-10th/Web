import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout'; 
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import MyPage from './pages/MyPage'; 
import LpListPage from './pages/LpListPage'; 
import LpDetailPage from './pages/LpDetailPage'; 
import SearchPage from './pages/SearchPage'; // 🥊 1. 8주차 검색 페이지 임포트 추가!

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 1. 인증 없이 접근 가능한 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 2. 메인 서비스 영역 (Layout 적용) */}
        <Route element={<Layout />}>
          {/* 기본 경로(/) 접속 시 LP 목록으로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/lps" replace />} />
          
          {/* LP 목록 페이지 */}
          <Route path="/lps" element={<LpListPage />} />

          {/* 🥊 2. 검색 페이지 경로 추가 (인증 없이 누구나 검색 가능하게 Layout 안에 배치) */}
          <Route path="/search" element={<SearchPage />} />

          {/* 3. 인증이 필요한 보호된 경로 */}
          <Route element={<ProtectedRoute />}>
            {/* 상세 페이지 */}
            <Route path="/lp/:lpid" element={<LpDetailPage />} />
            
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Route>
        
        {/* 4. 잘못된 경로 접근 시 로그인 페이지로 이동 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;