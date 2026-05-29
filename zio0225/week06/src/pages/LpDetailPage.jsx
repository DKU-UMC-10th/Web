import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getLpDetail, getLpComments } from '../api/lpApi';
// UTF-8 encoding rewrite

const LpDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const commentsEndRef = useRef(null);

  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpDetail(lpid),
    enabled: !!lpid,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const getLpData = (payload) => {
    if (!payload) return null;
    if (payload.data && payload.data.data) return payload.data.data;
    if (payload.data && payload.data.result) return payload.data.result;
    if (payload.result) return payload.result;
    if (payload.data) return payload.data;
    return payload;
  };

  const getCommentArray = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.result)) return payload.result;
    if (Array.isArray(payload.data)) {
      if (Array.isArray(payload.data.comments)) return payload.data.comments;
      if (Array.isArray(payload.data.result)) return payload.data.result;
      if (Array.isArray(payload.data.data)) return payload.data.data;
      return payload.data;
    }
    if (Array.isArray(payload.comments)) return payload.comments;
    if (Array.isArray(payload.items)) return payload.items;
    return [];
  };

  const getNextCursor = (payload) => {
    if (!payload) return undefined;
    return (
      payload.nextCursor ??
      payload.cursor ??
      payload.data?.nextCursor ??
      payload.data?.cursor ??
      payload.data?.pagination?.nextCursor ??
      payload.data?.pagination?.cursor ??
      payload.result?.nextCursor ??
      payload.result?.cursor ??
      payload.result?.pagination?.nextCursor ??
      payload.result?.pagination?.cursor ??
      undefined
    );
  };

  const {
    data: commentData,
    isLoading: commentLoading,
    isError: commentErrorState,
    error: commentErrorObject,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpid, order],
    queryFn: ({ pageParam }) => getLpComments({ lpid, cursor: pageParam, order, limit: 8 }),
    getNextPageParam: (lastPage) => getNextCursor(lastPage),
    enabled: !!lpid,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const lp = getLpData(data);

  const commentList = useMemo(() => {
    const pages = commentData?.pages ?? [];
    const raw = pages.flatMap(getCommentArray);
    return raw.map((item, index) => ({
      id: item.id ?? item.commentId ?? item._id ?? `comment-${index}`,
      author: item.author || item.writer || '익명',
      content: item.content || item.text || '',
      createdAt: item.createdAt || item.created_at || Date.now(),
    }));
  }, [commentData]);

  useEffect(() => {
    if (!commentsEndRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(commentsEndRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (!commentText.trim()) {
      setCommentError('댓글 내용을 입력해 주세요.');
      return;
    }
    setCommentError('');
    setCommentText('');
  };

  const renderCommentSkeleton = (count = 3) => (
    <>
      {[...Array(count)].map((_, idx) => (
        <div key={idx} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 animate-pulse">
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-32 rounded-full bg-zinc-900" />
            <div className="h-3 w-20 rounded-full bg-zinc-900" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full rounded-full bg-zinc-900" />
            <div className="h-4 w-5/6 rounded-full bg-zinc-900" />
            <div className="h-4 w-2/3 rounded-full bg-zinc-900" />
          </div>
        </div>
      ))}
    </>
  );

  if (isLoading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-xl">상세 정보 불러오는 중... ㅡㅡ</p>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <p className="text-red-500 mb-4">데이터를 가져오지 못했습니다. 🥊</p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
        뒤로 가기
      </button>
    </div>
  );

  if (!lp) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <p className="text-zinc-400">LP 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-lg shadow-black/20">
            <img
              src={lp?.thumbnail}
              alt={lp?.title}
              className="w-full rounded-3xl shadow-2xl shadow-black/40"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'https://placehold.co/400x400/1f2937/ffffff?text=NO+IMAGE';
              }}
            />
            <div className="mt-6 space-y-4 text-zinc-300">
              <h2 className="text-3xl font-bold text-white">{lp?.title}</h2>
              <p className="text-sm text-zinc-400">{new Date(lp?.createdAt || lp?.publishedAt || Date.now()).toLocaleDateString()} · 좋아요 {lp?.likes || 0}</p>
              <p className="text-base leading-relaxed">{lp?.content || '본문 내용이 없습니다.'}</p>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-lg shadow-black/20">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">LP 정보</h2>
                  <p className="mt-1 text-sm text-zinc-400">댓글 섹션은 아래에서 확인하세요.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-pink-500" type="button">좋아요</button>
                  <button className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-pink-500" type="button">수정</button>
                  <button className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500" type="button">삭제</button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-zinc-900 p-4">
                  <p className="text-sm text-zinc-400">앨범 제목</p>
                  <p className="mt-3 text-white">{lp?.title}</p>
                </div>
                <div className="rounded-3xl bg-zinc-900 p-4">
                  <p className="text-sm text-zinc-400">등록일</p>
                  <p className="mt-3 text-white">{new Date(lp?.createdAt || lp?.publishedAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-lg shadow-black/20">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">댓글</h3>
              <p className="mt-1 text-sm text-zinc-400">정렬을 변경하면 최신순/오래된순이 곧바로 반영됩니다.</p>
            </div>
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 p-1">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${order === 'desc' ? 'bg-pink-600 text-white' : 'text-zinc-300 hover:text-white'}`}
                onClick={() => setSearchParams({ order: 'desc' })}
              >
                최신순
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${order === 'asc' ? 'bg-pink-600 text-white' : 'text-zinc-300 hover:text-white'}`}
                onClick={() => setSearchParams({ order: 'asc' })}
              >
                오래된순
              </button>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                if (commentError) setCommentError('');
              }}
              rows={5}
              placeholder="댓글을 입력해 주세요."
              className="w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-white outline-none transition focus:border-pink-500"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-400">댓글 작성란은 디자인과 유효성 안내를 포함해 구현되었습니다.</p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:bg-zinc-700 disabled:text-zinc-400"
                disabled={!commentText.trim()}
              >
                댓글 등록
              </button>
            </div>
            {commentError && <p className="text-sm text-rose-400">{commentError}</p>}
          </form>

          <div className="mt-8 space-y-4">
            {commentLoading ? (
              renderCommentSkeleton(3)
            ) : commentErrorState ? (
              <div className="rounded-3xl border border-rose-500 bg-zinc-950 p-5 text-sm text-rose-200">
                댓글을 불러오지 못했습니다. {commentErrorObject?.message || ''}
              </div>
            ) : commentList.length === 0 ? (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">
                등록된 댓글이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {commentList.map((comment) => (
                  <div key={comment.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                    <div className="flex items-center justify-between gap-4 text-sm text-zinc-400">
                      <span>{comment.author}</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-4 text-white">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {isFetchingNextPage && renderCommentSkeleton(2)}
            <div ref={commentsEndRef} className="h-6" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LpDetailPage;
