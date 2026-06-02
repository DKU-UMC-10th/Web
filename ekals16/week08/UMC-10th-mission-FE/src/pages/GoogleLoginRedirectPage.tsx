import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AUTH_REDIRECT_PATH_KEY } from "../constants/authRedirect";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

const GoogleLoginRedirectPage = () => {
    const {setItem:setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {setItem:setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);
        const stateParam = urlParams.get("state");
        const redirectParam = urlParams.get("redirect");
        const redirectCandidate =
            stateParam ??
            redirectParam ??
            sessionStorage.getItem(AUTH_REDIRECT_PATH_KEY) ??
            localStorage.getItem(AUTH_REDIRECT_PATH_KEY) ??
            "/my";
        const redirectPath =
            redirectCandidate.startsWith("/") && !redirectCandidate.startsWith("//")
                ? redirectCandidate
                : "/my";

        if(accessToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            sessionStorage.removeItem(AUTH_REDIRECT_PATH_KEY);
            localStorage.removeItem(AUTH_REDIRECT_PATH_KEY);
            sessionStorage.removeItem(`auth-alert:${redirectPath}`);
            window.location.href = redirectPath;
        }
    }, [setAccessToken, setRefreshToken]);

    return (
        <div>
            구글 로그인 리다이렉트 페이지
        </div>
    );
}

export default GoogleLoginRedirectPage;
