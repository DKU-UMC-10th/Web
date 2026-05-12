type QueryStateProps = {
    message?: string;
    onRetry?: () => void;
};

export const LoadingGrid = () => {
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 15 }).map((_, index) => (
                <div
                    key={index}
                    className="aspect-square animate-pulse bg-[#191b22]"
                    aria-label="LP 목록을 불러오는 중"
                />
            ))}
        </div>
    );
};

export const LoadingPanel = () => {
    return (
        <div className="mx-auto w-full max-w-4xl rounded-md bg-[#282932] p-6">
            <div className="h-8 w-40 animate-pulse rounded bg-[#3a3c47]" />
            <div className="mx-auto mt-8 aspect-square w-full max-w-xl animate-pulse rounded bg-[#3a3c47]" />
            <div className="mt-8 space-y-3">
                <div className="h-4 animate-pulse rounded bg-[#3a3c47]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#3a3c47]" />
            </div>
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
