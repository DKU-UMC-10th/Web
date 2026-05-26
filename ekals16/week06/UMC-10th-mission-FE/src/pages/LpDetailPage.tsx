import { Link, useParams } from "react-router-dom";

import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import formatUploadedAt from "../utils/formatUploadedAt";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpid);

  if (isPending) {
    return <LoadingState />;
  }

  if (isError || !lp) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const authorName = lp.author?.name ?? `User ${lp.authorId}`;
  const authorAvatar = lp.author?.avatar;
  const uploadedAt = formatUploadedAt(lp.createdAt);
  const likeCount = lp.likes?.length ?? 0;

  return (
    <section className="mx-auto max-w-4xl rounded bg-zinc-900 px-5 py-6 text-white ring-1 ring-white/10 sm:px-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-sm font-bold text-zinc-900">
              {authorName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{authorName}</p>
            <p className="text-xs text-white/50">{uploadedAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Edit LP"
            className="rounded p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            ✎
          </button>
          <button
            type="button"
            aria-label="Delete LP"
            className="rounded p-2 text-white/70 transition hover:bg-white/10 hover:text-red-300"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-300">
              Title
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">{lp.title}</h1>
          </div>
          <Link
            to="/"
            className="rounded bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Back
          </Link>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative aspect-square w-full max-w-sm rounded bg-zinc-800 p-5 shadow-xl shadow-black/40">
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-black bg-black">
              {lp.thumbnail ? (
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                  No Image
                </div>
              )}
              <div className="absolute inset-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 bg-white shadow-inner" />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-300">
            Content
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/80">
            {lp.content || "No content."}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {lp.tags?.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-slate-600 px-3 py-1 text-xs font-semibold text-white/90"
            >
              # {tag.name}
            </span>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-lg font-semibold text-white transition hover:bg-white/10"
          >
            <span className="text-3xl text-pink-400">♥</span>
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LpDetailPage;
