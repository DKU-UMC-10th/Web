import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { deleteMyAccount, getMyInfo, postLogout } from "../apis/auth";
import LpEditorModal from "../components/LpEditorModal";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../hooks/useSidebar";

const HomeLayout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { accessToken, clearAuthTokens } = useAuth();
    const [isLpModalOpen, setIsLpModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const shouldOpenSidebarByDefault = window.matchMedia("(min-width: 1024px)").matches;
    const { isOpen: isSidebarOpen, close: closeSidebar, toggle: toggleSidebar } = useSidebar(shouldOpenSidebarByDefault);
    const isLoggedIn = Boolean(accessToken);

    const { data: myInfo } = useQuery({
        queryKey: ["my-info", accessToken],
        queryFn: getMyInfo,
        enabled: isLoggedIn,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });

    const finishAuthSession = () => {
        clearAuthTokens();
        queryClient.clear();
        navigate("/login");
    };

    const logoutMutation = useMutation({
        mutationFn: postLogout,
        onSettled: finishAuthSession,
    });

    const withdrawMutation = useMutation({
        mutationFn: deleteMyAccount,
        onSuccess: finishAuthSession,
    });

    return (
        <div className="min-h-dvh bg-black text-white">
            <header className="fixed left-0 right-0 top-0 z-30 h-20 bg-[#111111]">
                <div className="flex h-full items-center justify-between px-5">
                    <div className="flex items-center gap-5">
                        <button
                            type="button"
                            aria-label="사이드바 열기"
                            aria-controls="app-sidebar"
                            aria-expanded={isSidebarOpen}
                            className="text-white"
                            onClick={toggleSidebar}
                        >
                            <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
                            </svg>
                        </button>
                        <Link to="/" className="text-3xl font-extrabold text-[#ff2ea3]">
                            돌려돌려LP판
                        </Link>
                    </div>
                    <div className="flex items-center gap-5 text-lg font-semibold">
                        <span aria-hidden="true" className="text-3xl">
                            🔍
                        </span>
                        {isLoggedIn ? (
                            <>
                                <span className="hidden sm:inline">{myInfo?.data?.name ?? "회원"}님 반갑습니다.</span>
                                <button type="button" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending} className="hover:text-[#ff2ea3] disabled:text-[#7c818f]">
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-[#ff2ea3]">
                                    로그인
                                </Link>
                                <Link to="/signup" className="rounded-md bg-[#ff2ea3] px-4 py-2 hover:bg-[#e52593]">
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div
                role="button"
                tabIndex={0}
                aria-label="사이드바 닫기"
                onClick={closeSidebar}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        closeSidebar();
                    }
                }}
                className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ease-in-out lg:hidden ${
                    isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <aside
                id="app-sidebar"
                className={`fixed bottom-0 left-0 top-20 z-50 w-60 bg-[#151515] transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <nav className="flex h-full flex-col justify-between p-8">
                    <div className="space-y-8 text-lg font-semibold">
                        <Link to="/search" onClick={closeSidebar} className="block hover:text-[#ff2ea3]">
                            찾기
                        </Link>
                        <Link to="/my" onClick={closeSidebar} className="block hover:text-[#ff2ea3]">
                            마이페이지
                        </Link>
                    </div>
                    {isLoggedIn && (
                        <button
                            type="button"
                            onClick={() => {
                                closeSidebar();
                                setIsWithdrawModalOpen(true);
                            }}
                            className="text-left text-[#d8dbe4] hover:text-[#ff2ea3]"
                        >
                            탈퇴하기
                        </button>
                    )}
                </nav>
            </aside>

            <main className={`min-h-dvh pt-20 transition-[padding] duration-300 ease-in-out ${isSidebarOpen ? "lg:pl-60" : "lg:pl-0"}`}>
                <Outlet />
            </main>

            {isLoggedIn && (
                <button
                    type="button"
                    onClick={() => setIsLpModalOpen(true)}
                    aria-label="LP 등록"
                    className="fixed bottom-8 right-8 z-30 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff2ea3] shadow-xl transition-colors hover:bg-[#e52593]"
                >
                    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" className="block">
                        <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </button>
            )}

            {isLpModalOpen && <LpEditorModal onClose={() => setIsLpModalOpen(false)} />}

            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-md rounded-md bg-[#282932] p-8 text-center text-white shadow-2xl">
                        <button type="button" onClick={() => setIsWithdrawModalOpen(false)} aria-label="닫기" className="ml-auto block text-3xl">
                            ×
                        </button>
                        <p className="mt-10 text-2xl font-bold">정말 탈퇴하시겠습니까?</p>
                        <div className="mt-10 flex justify-center gap-8">
                            <button
                                type="button"
                                onClick={() => withdrawMutation.mutate()}
                                disabled={withdrawMutation.isPending}
                                className="h-12 w-32 rounded-md bg-[#d8dce5] font-semibold text-black disabled:bg-[#7c818f]"
                            >
                                예
                            </button>
                            <button type="button" onClick={() => setIsWithdrawModalOpen(false)} className="h-12 w-32 rounded-md bg-[#ff2ea3] font-semibold text-white">
                                아니요
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeLayout;
