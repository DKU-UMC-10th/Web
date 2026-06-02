import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_REDIRECT_PATH_KEY } from "../constants/authRedirect";
import { useAuth } from "../context/useAuth";

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const alertKey = `auth-alert:${location.pathname}`;
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;

    useEffect(() => {
        if (accessToken) {
            setShouldRedirect(false);
            return;
        }

        if (!sessionStorage.getItem(alertKey)) {
            alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
            sessionStorage.setItem(alertKey, "true");
        }

        sessionStorage.setItem(AUTH_REDIRECT_PATH_KEY, redirectPath);
        localStorage.setItem(AUTH_REDIRECT_PATH_KEY, redirectPath);
        setShouldRedirect(true);
    }, [accessToken, alertKey, redirectPath]);

    if (!accessToken) {
        if (!shouldRedirect) {
            return null;
        }

        return (
            <Navigate
                to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                replace
                state={{ from: location }}
            />
        );
    }
    
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default ProtectedLayout
