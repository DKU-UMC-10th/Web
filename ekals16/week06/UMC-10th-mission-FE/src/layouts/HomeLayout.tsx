import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Outlet } from 'react-router-dom'
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/useAuth";

const HomeLayout = () => {
  const { accessToken, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: myInfo } = useQuery({
    queryKey: ["me"],
    queryFn: getMyInfo,
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60,
  });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      <nav className='h-16 border-b border-white/10 px-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            className='inline-flex items-center justify-center rounded p-1 text-white/80 hover:bg-white/10 sm:hidden'
            aria-label='Open sidebar'
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
            </svg>
          </button>
          <Link to='/' className='text-3xl font-black tracking-tight text-pink-500'>
            돌려돌려LP판
          </Link>
        </div>
        {accessToken ? (
          <div className='flex items-center gap-3 text-xs sm:text-sm'>
            <span className='text-white/70'>
              {myInfo?.data.name ?? "회원"}님 반갑습니다.
            </span>
            <button
              onClick={handleLogout}
              className='rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors'
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <Link
              to='/login'
              className='rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors'
            >
              로그인
            </Link>
            <Link
              to='/signup'
              className='rounded bg-pink-500 px-3 py-1 text-xs font-semibold text-white hover:bg-pink-400 transition-colors'
            >
              회원가입
            </Link>
          </div>
        )}
      </nav>
      <div className='flex min-h-[calc(100vh-64px)]'>
        <div
          className={
            isSidebarOpen
              ? "fixed inset-0 z-40 bg-black/60 sm:hidden"
              : "hidden"
          }
          role='button'
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
              ? "fixed inset-y-0 left-0 z-50 w-56 border-r border-white/10 bg-black px-3 py-6 sm:static sm:z-auto sm:w-56"
              : "hidden w-20 sm:block sm:w-56 shrink-0 border-r border-white/10 bg-black/70 px-3 py-6"
          }
        >
          <div className='flex items-center justify-between sm:hidden'>
            <div className='text-[10px] uppercase tracking-[0.2em] text-white/50'>Menu</div>
            <button
              type='button'
              className='rounded p-1 text-white/70 hover:bg-white/10'
              aria-label='Close sidebar'
              onClick={() => setIsSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className='text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/50'>
            Menu
          </div>
          <nav className='mt-4 flex flex-col gap-2 text-xs sm:text-sm'>
            <Link
              to='/'
              className='rounded px-2 py-2 hover:bg-white/10'
            >
              홈
            </Link>
            <Link
              to='/my'
              className='rounded px-2 py-2 hover:bg-white/10'
            >
              마이페이지
            </Link>
          </nav>
        </aside>
        <main className='flex-1 min-w-0 overflow-y-auto px-4 py-6 sm:px-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default HomeLayout
