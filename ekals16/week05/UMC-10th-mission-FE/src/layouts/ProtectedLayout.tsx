import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedLayout = () => {
    const {accessToken} = useAuth();

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }
    
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default ProtectedLayout