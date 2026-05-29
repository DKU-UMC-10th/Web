import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout'; 
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import MyPage from './pages/MyPage'; 
import LpListPage from './pages/LpListPage'; 
import LpDetailPage from './pages/LpDetailPage'; 
import SearchPage from './pages/SearchPage'; 

function App() {
  return (
    <AuthProvider>
      {/* ❌ 임시로 넣었던 버튼과 사이드바 컴포넌트를 지워줌으로써 원래의 깔끔한 라우터 구조 유지! */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/lps" replace />} />
          <Route path="/lps" element={<LpListPage />} />
          <Route path="/search" element={<SearchPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/lp/:lpid" element={<LpDetailPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;