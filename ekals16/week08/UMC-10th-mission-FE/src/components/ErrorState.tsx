type ErrorStateProps = {
  onRetry: () => void;
};

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm text-red-400">Failed to load.</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded bg-pink-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-pink-400"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorState;
