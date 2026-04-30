import { Link, Outlet } from 'react-router-dom'

const HomeLayout = () => {
  return (
    <div className='min-h-screen bg-black text-white'>
        <nav className='h-16 border-b border-white/10 px-6 flex items-center justify-between'>
          <Link to='/' className='text-3xl font-black tracking-tight text-pink-500'>
            돌려돌려LP판
          </Link>
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
        </nav>
        <main className='min-h-[calc(100vh-64px)]'>
            <Outlet />
        </main>
    </div>
  )
}

export default HomeLayout
