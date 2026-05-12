type QueryStateProps = {
    message?: string;
    onRetry?: () => void;
};

const LpCardSkeleton = () => {
    return (
        <div
            className="skeleton-shimmer aspect-square animate-pulse overflow-hidden bg-[#9aa4af]"
            aria-label="LP 카드 로딩 중"
        />
    );
};

export const LpCardSkeletonGrid = ({ count = 10 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-busy="true">
            {Array.from({ length: count }).map((_, index) => (
                <LpCardSkeleton key={index} />
            ))}
        </div>
    );
};

export const LpDetailSkeleton = () => {
    return (
        <div className="mx-auto w-full max-w-4xl rounded-md bg-[#282932] p-6" aria-busy="true">
            <div className="skeleton-shimmer h-8 w-40 animate-pulse rounded bg-[#9aa4af]" />
            <div className="skeleton-shimmer mx-auto mt-8 aspect-square w-full max-w-xl animate-pulse rounded bg-[#9aa4af]" />
            <div className="mt-8 space-y-3">
                <div className="skeleton-shimmer h-4 animate-pulse rounded bg-[#9aa4af]" />
                <div className="skeleton-shimmer h-4 w-3/4 animate-pulse rounded bg-[#9aa4af]" />
            </div>
        </div>
    );
};

export const LoadingPanel = LpDetailSkeleton;

export const CommentSkeletonList = ({ count = 8 }: { count?: number }) => {
    return (
        <div className="space-y-7" aria-busy="true">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex animate-pulse gap-4">
                    <div className="skeleton-shimmer h-10 w-10 shrink-0 rounded-full bg-[#9aa4af]" />
                    <div className="flex-1 space-y-3 pt-1">
                        <div className="skeleton-shimmer h-5 w-40 rounded bg-[#9aa4af]" />
                        <div className="skeleton-shimmer h-6 w-full max-w-3xl rounded bg-[#9aa4af]" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ErrorState = ({ message = "데이터를 불러오지 못했습니다.", onRetry }: QueryStateProps) => {
    return (
        <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
            <p className="text-[#f2f3f8]">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="h-10 rounded-md bg-[#ff2ea3] px-4 font-semibold text-white transition-colors hover:bg-[#e52593]"
                >
                    다시 시도
                </button>
            )}
        </div>
    );
};
