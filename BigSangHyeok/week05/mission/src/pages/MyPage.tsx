import { useEffect, useState } from "react";
import axios from "axios";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

type MyInfo = ResponseMyInfoDto["data"];

const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;

        if (!error.response) {
            return "서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.";
        }

        return serverMessage ?? fallback;
    }

    return fallback;
};

const MyPage = () => {
    const [user, setUser] = useState<MyInfo | null>(null);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("보호된 API 요청 대기 중");
    const [refreshCount, setRefreshCount] = useState(0);

    const fetchMyInfo = async () => {
        setError("");
        setStatus("GET /v1/users/me 요청 중...");

        try {
            const response = await getMyInfo();

            setUser(response.data);
            setStatus("보호된 API 요청 성공");
        } catch (err) {
            setError(getErrorMessage(err, "내 정보를 불러오지 못했습니다."));
            setStatus("보호된 API 요청 실패");
        }
    };

    const makeExpiredAccessToken = () => {
        localStorage.setItem("accessToken", "expired-access-token-for-demo");
        setStatus("Access Token을 임의로 만료된 값으로 변경했습니다.");
    };

    useEffect(() => {
        const handleRefreshSuccess = () => {
            setRefreshCount((count) => count + 1);
            setStatus("401 발생 -> Refresh Token으로 재발급 -> 원래 요청 재시도 성공");
        };

        const handleRefreshFail = () => {
            setStatus("Refresh Token 재발급 실패: 다시 로그인해야 합니다.");
        };

        window.addEventListener("token-refresh-success", handleRefreshSuccess);
        window.addEventListener("token-refresh-fail", handleRefreshFail);
        void fetchMyInfo();

        return () => {
            window.removeEventListener("token-refresh-success", handleRefreshSuccess);
            window.removeEventListener("token-refresh-fail", handleRefreshFail);
        };
    }, []);

    return (
        <section className="min-h-[calc(100dvh-4rem)] px-4 flex items-start justify-center pt-16">
            <div className="w-full max-w-130 text-[#f2f3f8] space-y-6">
                <div>
                    <p className="text-sm font-semibold uppercase text-[#ff69bd]">Protected Route</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">내 정보</h1>
                    <p className="mt-3 text-[#b8bcc8]">
                        로그인한 사용자만 접근할 수 있는 페이지입니다. Access Token이 만료되면 Refresh Token으로
                        자동 재발급한 뒤 원래 요청을 다시 보냅니다.
                    </p>
                </div>

                <div className="rounded-md border border-[#2b2d38] bg-[#111217] p-4 space-y-3">
                    <strong className="block text-white">Refresh Token 동작 확인</strong>
                    <p className="text-[#cfd2da]">{status}</p>
                    <p className="text-[#cfd2da]">토큰 재발급 성공 횟수: {refreshCount}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            type="button"
                            onClick={makeExpiredAccessToken}
                            className="h-10 px-3 rounded-md bg-[#1e212a] hover:bg-[#2d313e] transition-colors"
                        >
                            Access Token 만료 상황 만들기
                        </button>
                        <button
                            type="button"
                            onClick={fetchMyInfo}
                            className="h-10 px-3 rounded-md bg-[#ff2ea3] hover:bg-[#e52593] transition-colors"
                        >
                            보호 API 다시 요청
                        </button>
                    </div>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}
                {!user && !error && <p className="text-[#cfd2da]">내 정보를 불러오는 중...</p>}
                {user && (
                    <dl className="rounded-md border border-[#2b2d38] bg-[#111217] divide-y divide-[#2b2d38]">
                        <div className="grid grid-cols-[6rem_1fr] gap-3 p-4">
                            <dt className="text-[#9ea3b1]">이름</dt>
                            <dd>{user.name}</dd>
                        </div>
                        <div className="grid grid-cols-[6rem_1fr] gap-3 p-4">
                            <dt className="text-[#9ea3b1]">이메일</dt>
                            <dd>{user.email}</dd>
                        </div>
                        <div className="grid grid-cols-[6rem_1fr] gap-3 p-4">
                            <dt className="text-[#9ea3b1]">소개</dt>
                            <dd>{user.bio ?? "등록된 소개가 없습니다."}</dd>
                        </div>
                    </dl>
                )}
            </div>
        </section>
    );
};

export default MyPage;
