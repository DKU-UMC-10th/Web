import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout'; 
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import MyPage from './pages/MyPage'; 
import LpListPage from './pages/LpListPage'; 
import LpDetailPage from './pages/LpDetailPage'; 

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
          
          {/* LP 목록 페이지 (모달 생성을 포함하므로 /lps/new 같은 경로는 필요 없음) */}
          <Route path="/lps" element={<LpListPage />} />

          {/* 3. 인증이 필요한 보호된 경로 */}
          <Route element={<ProtectedRoute />}>
            {/* 🚨 주의: 이전에 있던 /lps/new 경로는 삭제했습니다. 
                /lps 주소에서 모달만 띄우는 것이 지오님의 의도에 맞고 에러를 방지합니다.
            */}
            
            {/* 상세 페이지: :lpid는 실제 데이터의 숫자 ID가 들어옵니다. */}
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