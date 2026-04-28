import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // 🥊 Context에만 의존하지 말고, 실제 저장소(localStorage)를 직접 확인하세요!
    // 로그인할 때 'accessToken'이라는 이름으로 저장하셨죠?
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert("로그인이 필요한 페이지입니다! ✋");
        return <Navigate to="/login" replace />;
    }

    // 토큰이 있다면 안심하고 마이페이지(자식)를 보여줍니다.
    return <Outlet />;
};

export default ProtectedRoute;