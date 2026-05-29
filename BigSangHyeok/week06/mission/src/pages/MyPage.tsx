import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { ErrorState, LoadingPanel } from "../components/QueryState";

const MyPage = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["my-info"],
        queryFn: getMyInfo,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return (
            <section className="px-4 py-10">
                <LoadingPanel />
            </section>
        );
    }

    if (isError || !data?.data) {
        return (
            <section className="px-4 py-10">
                <ErrorState message="내 정보를 불러오지 못했습니다." onRetry={() => void refetch()} />
            </section>
        );
    }

    return (
        <section className="px-4 py-10">
            <div className="mx-auto w-full max-w-2xl rounded-md border border-[#2b2d38] bg-[#111217] p-6 text-[#f2f3f8]">
                <h1 className="text-3xl font-semibold">마이페이지</h1>
                <dl className="mt-6 divide-y divide-[#2b2d38]">
                    <div className="grid grid-cols-[6rem_1fr] gap-3 py-4">
                        <dt className="text-[#9ea3b1]">이름</dt>
                        <dd>{data.data.name}</dd>
                    </div>
                    <div className="grid grid-cols-[6rem_1fr] gap-3 py-4">
                        <dt className="text-[#9ea3b1]">이메일</dt>
                        <dd>{data.data.email}</dd>
                    </div>
                    <div className="grid grid-cols-[6rem_1fr] gap-3 py-4">
                        <dt className="text-[#9ea3b1]">소개</dt>
                        <dd>{data.data.bio ?? "등록된 소개가 없습니다."}</dd>
                    </div>
                </dl>
            </div>
        </section>
    );
};

export default MyPage;
