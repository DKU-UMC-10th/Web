// src/components/ProtectedRoute.tsx (새로 만들기)
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        alert("로그인이 필요한 페이지입니다!");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;