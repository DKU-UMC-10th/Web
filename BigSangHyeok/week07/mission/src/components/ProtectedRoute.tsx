import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const location = useLocation();
    const { accessToken } = useAuth();

    if (!accessToken) {
        alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
