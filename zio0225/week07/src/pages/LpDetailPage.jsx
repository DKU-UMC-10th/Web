import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // ✅ Mutation 추가
import { getLpDetail, getLpComments } from '../api/lpApi';
import { postComment } from '../api/CommentApi'; // ✅ 댓글 작성 API (경로 확인!)

const LpDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ✅ 무효화를 위해 추가
  const [searchParams, setSearchParams] = useSearchParams();
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const commentsEndRef = useRef(null);

  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  // --- 1. 데이터 페칭 (지오님 원본 유지) ---
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpDetail(lpid),
    enabled: !!lpid,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  // --- 2. [중요] 댓글 등록 Mutation 추가 ---
  const createMutation = useMutation({
    mutationFn: (content) => postComment(lpid, { content }),
    onSuccess: () => {
      // 등록 성공 시 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid, order] });
      setCommentText(''); // 입력창 비우기
      setCommentError('');
      alert('댓글이 등록되었습니다! ✍️');
    },
    onError: (error) => {
      setCommentError(`작성 실패: ${error.response?.data?.message || '에러 발생'}`);
    }
  });

  // --- 3. 데이터 파싱 함수 (지오님 원본 100% 동일) ---
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
      payload.nextCursor ?? payload.cursor ?? payload.data?.nextCursor ?? payload.data?.cursor ??
      payload.data?.pagination?.nextCursor ?? payload.data?.pagination?.cursor ??
      payload.result?.nextCursor ?? payload.result?.cursor ??
      payload.result?.pagination?.nextCursor ?? payload.result?.pagination?.cursor ?? undefined
    );
  };

  // --- 4. 무한 스크롤 조회 (지오님 원본 유지) ---
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

  // --- 5. 핸들러 수정 ---
  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (!commentText.trim()) {
      setCommentError('댓글 내용을 입력해 주세요.');
      return;
    }
    // ✅ 단순히 비우지 않고 서버로 보냅니다!
    createMutation.mutate(commentText);
  };

  const renderCommentSkeleton = (count = 3) => (
    <>
      {[...Array(count)].map((_, idx) => (
        <div key={idx} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 animate-pulse mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-32 rounded-full bg-zinc-900" />
            <div className="h-3 w-20 rounded-full bg-zinc-900" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full rounded-full bg-zinc-900" />
            <div className="h-4 w-5/6 rounded-full bg-zinc-900" />
          </div>
        </div>
      ))}
    </>
  );

  if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-xl">정보 불러오는 중... ㅡㅡ</p></div>;

  if (isError) return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6"><p className="text-red-500 mb-4">데이터를 가져오지 못했습니다. 🥊</p><button onClick={() => navigate(-1)} className="px-6 py-2 bg-pink-600 text-white rounded-lg">뒤로 가기</button></div>;

  if (!lp) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-zinc-400">LP 정보를 찾을 수 없습니다.</p></div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-lg shadow-black/20">
            <img src={lp?.thumbnail} alt={lp?.title} className="w-full rounded-3xl shadow-2xl" />
            <div className="mt-6 space-y-4 text-zinc-300">
              <h2 className="text-3xl font-bold text-white">{lp?.title}</h2>
              <p className="text-sm text-zinc-400">{new Date(lp?.createdAt || lp?.publishedAt || Date.now()).toLocaleDateString()} · 좋아요 {lp?.likes || 0}</p>
              <p className="text-base leading-relaxed">{lp?.content || '본문 내용이 없습니다.'}</p>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">LP 정보</h2>
                </div>
                <div className="flex gap-3">
                  <button className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold hover:border-pink-500">좋아요</button>
                  <button className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold hover:border-pink-500">수정</button>
                  <button className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-red-400 hover:border-red-500">삭제</button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-zinc-900 p-4"><p className="text-sm text-zinc-400">앨범 제목</p><p className="mt-3 text-white">{lp?.title}</p></div>
                <div className="rounded-3xl bg-zinc-900 p-4"><p className="text-sm text-zinc-400">등록일</p><p className="mt-3 text-white">{new Date(lp?.createdAt || lp?.publishedAt || Date.now()).toLocaleDateString()}</p></div>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-lg shadow-black/20">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h3 className="text-2xl font-bold text-white">댓글</h3></div>
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 p-1">
              <button onClick={() => setSearchParams({ order: 'desc' })} className={`rounded-full px-4 py-2 text-sm font-semibold ${order === 'desc' ? 'bg-pink-600 text-white' : 'text-zinc-300'}`}>최신순</button>
              <button onClick={() => setSearchParams({ order: 'asc' })} className={`rounded-full px-4 py-2 text-sm font-semibold ${order === 'asc' ? 'bg-pink-600 text-white' : 'text-zinc-300'}`}>오래된순</button>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(e) => { setCommentText(e.target.value); if (commentError) setCommentError(''); }}
              rows={5}
              placeholder="댓글을 입력해 주세요."
              className="w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-white outline-none focus:border-pink-500"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-400">댓글을 자유롭게 남겨주세요.</p>
              <button
                type="submit"
                className="rounded-full bg-pink-600 px-8 py-3 font-bold hover:bg-pink-700 disabled:bg-zinc-700"
                disabled={!commentText.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? '등록 중...' : '댓글 등록'}
              </button>
            </div>
            {commentError && <p className="text-sm text-rose-400">{commentError}</p>}
          </form>

          <div className="mt-8 space-y-4">
            {commentLoading ? renderCommentSkeleton(3) : commentList.length === 0 ? (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">등록된 댓글이 없습니다.</div>
            ) : (
              <div className="space-y-4">
                {commentList.map((comment) => (
                  <div key={comment.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                    <div className="flex justify-between text-sm text-zinc-400">
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