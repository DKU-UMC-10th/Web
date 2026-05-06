import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <section className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4">
            <div className="text-center space-y-5">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center">대상혁</h1>
                <Link
                    to="/my"
                    className="inline-flex h-11 px-4 items-center justify-center rounded-md bg-[#ff2ea3] hover:bg-[#e52593] transition-colors"
                >
                    보호된 내 정보 페이지로 이동
                </Link>
            </div>
        </section>
    );
};

export default HomePage;
