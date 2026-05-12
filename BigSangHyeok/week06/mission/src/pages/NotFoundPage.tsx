import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <section className="min-h-[calc(100dvh-4rem)] px-4 flex items-center justify-center">
            <div className="text-center space-y-4 text-[#f2f3f8]">
                <h1 className="text-3xl font-semibold">페이지를 찾을 수 없습니다.</h1>
                <Link
                    to="/"
                    className="inline-flex h-11 px-4 items-center justify-center rounded-md bg-[#1e212a] hover:bg-[#2d313e] transition-colors"
                >
                    홈으로 이동
                </Link>
            </div>
        </section>
    );
};

export default NotFoundPage;
