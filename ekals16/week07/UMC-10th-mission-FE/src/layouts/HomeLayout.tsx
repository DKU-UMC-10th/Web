import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { deleteMyInfo, getMyInfo } from "../apis/auth";
import { useAuth } from "../context/useAuth";

const HomeLayout = () => {
  const navigate = useNavigate();
  const { accessToken, logout, clearAuth } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { data: myInfo } = useQuery({
    queryKey: ["me"],
    queryFn: getMyInfo,
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60,
  });

  const withdrawMutation = useMutation({
    mutationFn: deleteMyInfo,
    onSuccess: () => {
      clearAuth();
      setIsWithdrawModalOpen(false);
      navigate("/login", { replace: true });
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const handleWithdraw = () => {
    withdrawMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded p-1 text-white/80 hover:bg-white/10 sm:hidden"
            aria-label="사이드바 열기"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>
          <Link to="/" className="text-3xl font-black tracking-tight text-pink-500">
            돌려돌려LP판
          </Link>
        </div>
        {accessToken ? (
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-white/70">
              {myInfo?.data.name ?? "회원"}님 반갑습니다.
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="rounded bg-pink-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-pink-400"
            >
              회원가입
            </Link>
          </div>
        )}
      </nav>
      <div className="flex min-h-[calc(100vh-64px)]">
        <div
          className={
            isSidebarOpen ? "fixed inset-0 z-40 bg-black/60 sm:hidden" : "hidden"
          }
          role="button"
          tabIndex={0}
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsSidebarOpen(false);
            }
          }}
        />
        <aside
          className={
            isSidebarOpen
              ? "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-white/10 bg-black px-3 py-6 sm:static sm:z-auto sm:w-56"
              : "hidden w-20 shrink-0 flex-col border-r border-white/10 bg-black/70 px-3 py-6 sm:flex sm:w-56"
          }
        >
          <div className="flex items-center justify-between sm:hidden">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              Menu
            </div>
            <button
              type="button"
              className="rounded p-1 text-white/70 hover:bg-white/10"
              aria-label="사이드바 닫기"
              onClick={() => setIsSidebarOpen(false)}
            >
              X
            </button>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-xs">
            Menu
          </div>
          <nav className="mt-4 flex flex-col gap-2 text-xs sm:text-sm">
            <Link to="/" className="rounded px-2 py-2 hover:bg-white/10">
              찾기
            </Link>
            <Link to="/my" className="rounded px-2 py-2 hover:bg-white/10">
              마이페이지
            </Link>
          </nav>
          {accessToken && (
            <button
              type="button"
              onClick={() => setIsWithdrawModalOpen(true)}
              className="mt-auto rounded px-2 py-2 text-left text-xs text-white/45 transition hover:bg-white/10 hover:text-red-300"
            >
              탈퇴하기
            </button>
          )}
        </aside>
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>

      {isWithdrawModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setIsWithdrawModalOpen(false)}
          role="presentation"
        >
          <section
            className="relative w-full max-w-sm rounded bg-zinc-800 px-8 py-14 text-center text-white shadow-2xl ring-1 ring-white/10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute right-4 top-4 rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="탈퇴 확인 모달 닫기"
            >
              X
            </button>
            <h2 id="withdraw-title" className="text-sm font-semibold">
              정말 탈퇴하시겠습니까?
            </h2>
            {withdrawMutation.isError && (
              <p className="mt-4 text-xs text-red-300">
                탈퇴 요청에 실패했습니다. 다시 시도해주세요.
              </p>
            )}
            <div className="mt-8 flex justify-center gap-6">
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={withdrawMutation.isPending}
                className="rounded bg-slate-200 px-7 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/30"
              >
                예
              </button>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="rounded bg-pink-500 px-7 py-2 text-sm font-semibold text-white transition hover:bg-pink-400"
              >
                아니요
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default HomeLayout;
