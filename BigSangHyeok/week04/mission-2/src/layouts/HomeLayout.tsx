import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="min-h-dvh flex flex-col bg-black text-white">
            <nav className="h-16 px-5 flex items-center justify-between bg-[#111217] border-b border-[#1f2028]">
                <Link to="/" className="text-[#ff2ea3] font-extrabold text-2xl tracking-tight">
                    대상혁
                </Link>
                <div className="flex items-center gap-2.5">
                    <Link
                        to="/login"
                        className="px-3 py-1.5 text-sm rounded-md bg-black border border-[#2b2d38] hover:bg-[#14151d] transition-colors"
                    >
                        로그인
                    </Link>
                    <Link
                        to="/signup"
                        className="px-3 py-1.5 text-sm rounded-md bg-[#ff2ea3] hover:bg-[#e52593] transition-colors"
                    >
                        회원가입
                    </Link>
                </div>
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;