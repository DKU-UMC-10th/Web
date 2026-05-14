import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
    const location = useLocation();
    const token = localStorage.getItem('accessToken');
    const [confirmed, setConfirmed] = useState(false);
    const [requested, setRequested] = useState(false);

    useEffect(() => {
        if (!token && !requested) {
            setRequested(true);
            const accept = window.confirm('로그인이 필요한 페이지입니다. 로그인 페이지로 이동하시겠습니까?');
            setConfirmed(accept);
        }
    }, [token, requested]);

    if (!token) {
        if (!requested) return null;
        if (!confirmed) {
            return <Navigate to="/" replace />;
        }
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;