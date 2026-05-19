import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setTokens } from "../utils/token";

const getTokenFromUrl = (search: string, hash: string, key: string) => {
    const queryParams = new URLSearchParams(search);
    const hashParams = new URLSearchParams(hash.replace(/^#/, ""));

    return queryParams.get(key) ?? hashParams.get(key);
};

const GoogleCallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState("Google 로그인을 처리하고 있습니다...");

    useEffect(() => {
        const accessToken = getTokenFromUrl(location.search, location.hash, "accessToken");
        const refreshToken = getTokenFromUrl(location.search, location.hash, "refreshToken");

        if (!accessToken || !refreshToken) {
            setMessage("Google 로그인 토큰을 찾을 수 없습니다.");
            return;
        }

        setTokens(accessToken, refreshToken);
        navigate("/", { replace: true });
    }, [location.hash, location.search, navigate]);

    return (
        <section className="flex min-h-[calc(100dvh-5rem)] items-start justify-center px-4 pt-20">
            <div className="w-full max-w-md space-y-5 text-center text-[#f2f3f8]">
                <h1 className="text-3xl font-semibold">Google 로그인</h1>
                <p className="text-[#cfd2da]">{message}</p>
                <Link to="/login" className="inline-flex h-11 items-center justify-center rounded-md bg-[#1e212a] px-4 hover:bg-[#2d313e]">
                    로그인으로 돌아가기
                </Link>
            </div>
        </section>
    );
};

export default GoogleCallbackPage;
