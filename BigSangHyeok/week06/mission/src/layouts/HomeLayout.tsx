import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

const HomeLayout = () => {
    const navigate = useNavigate();
    const { accessToken, logout } = useAuth();
    const isLoggedIn = Boolean(accessToken);
    const { data: myInfo } = useQuery({
        queryKey: ["my-info", accessToken],
        queryFn: getMyInfo,
        enabled: isLoggedIn,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });

    const closeSidebar = () => document.body.classList.remove("sidebar-open");
    const toggleSidebar = () => document.body.classList.toggle("sidebar-open");

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-dvh bg-black text-white">
            <header className="fixed left-0 right-0 top-0 z-30 h-20 bg-[#111111]">
                <div className="flex h-full items-center justify-between px-5">
                    <div className="flex items-center gap-5">
                        <button type="button" aria-label="사이드바 열기" className="text-white lg:hidden" onClick={toggleSidebar}>
                            <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                            </svg>
                        </button>
                        <Link to="/" className="text-3xl font-extrabold text-[#ff2ea3]">
                            돌려돌려LP판
                        </Link>
                    </div>
                    <div className="flex items-center gap-5 text-lg font-semibold">
                        <span aria-hidden="true" className="text-3xl">⌕</span>
                        {isLoggedIn ? (
                            <>
                                <span className="hidden sm:inline">{myInfo?.data?.name ?? "회원"}님 반갑습니다.</span>
                                <button type="button" onClick={handleLogout} className="hover:text-[#ff2ea3]">
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
                onKeyDown={closeSidebar}
                className="sidebar-backdrop fixed inset-0 z-40 hidden bg-black/60 lg:hidden"
            />
            <aside className="sidebar fixed bottom-0 left-0 top-20 z-50 w-60 -translate-x-full bg-[#151515] transition-transform lg:translate-x-0">
                <nav className="flex h-full flex-col justify-between p-8">
                    <div className="space-y-8 text-lg font-semibold">
                        <Link to="/" onClick={closeSidebar} className="block hover:text-[#ff2ea3]">⌕ 찾기</Link>
                        <Link to="/my" onClick={closeSidebar} className="block hover:text-[#ff2ea3]">● 마이페이지</Link>
                    </div>
                    <button type="button" className="text-left text-[#d8dbe4] hover:text-[#ff2ea3]">
                        탈퇴하기
                    </button>
                </nav>
            </aside>

            <main className="min-h-dvh pt-20 lg:pl-60">
                <Outlet />
            </main>

            <Link
                to="/lp/new"
                aria-label="LP 등록"
                className="fixed bottom-8 right-8 z-30 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff2ea3] text-5xl font-bold shadow-xl transition-colors hover:bg-[#e52593]"
            >
                +
            </Link>
        </div>
    );
};

export default HomeLayout;
