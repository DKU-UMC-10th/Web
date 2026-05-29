import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLpDetail, getLpComments } from '../api/lpApi';
import { postComment } from '../api/CommentApi';
import api from '../api/axios';

const LpDetailPage = () => {
  const { lpid } = useParams();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [commentText, setCommentText] = useState('');
  
  // 🥊 버튼 UI 즉각 반응을 위한 로컬 상태
  const [localIsLiked, setLocalIsLiked] = useState(null);
  
  const commentsEndRef = useRef(null);
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  // --- 1. 상세 데이터 페칭 ---
  const { data, isLoading } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpDetail(lpid),
    enabled: !!lpid,
    onSuccess: (res) => {
      const actualData = res?.data?.data || res?.data?.result || res?.result || res?.data || res;
      // 서버에서 데이터를 새로 가져올 때마다 로컬 상태 동기화
      setLocalIsLiked(!!actualData?.isLiked);
    }
  });

  const lp = useMemo(() => {
    const raw = data?.data?.data || data?.data?.result || data?.result || data?.data || data;
    if (!raw) return null;
    // UI는 로컬 상태를 최우선으로 따름
    return { ...raw, isLiked: localIsLiked ?? !!raw.isLiked };
  }, [data, localIsLiked]);

  const parseLikesCount = (likes) => {
    if (typeof likes === 'number') return likes;
    if (Array.isArray(likes)) return likes.length;
    return Number(likes?.count ?? likes?.total ?? likes ?? 0);
  };

  // --- 2. 좋아요 Mutation (Conflict 방어 🥊) ---
  const likeMutation = useMutation({
    mutationFn: async (isLiked) => {
      if (isLiked) return await api.delete(`/v1/lps/${lpid}/likes`);
      return await api.post(`/v1/lps/${lpid}/likes`);
    },
    onMutate: async (currentLikedStatus) => {
      setLocalIsLiked(!currentLikedStatus); // 즉시 반전

      await queryClient.cancelQueries({ queryKey: ['lp', lpid] });
      const previousLp = queryClient.getQueryData(['lp', lpid]);
      
      queryClient.setQueryData(['lp', lpid], (old) => {
        if (!old) return old;
        const next = JSON.parse(JSON.stringify(old));
        let target = next.data?.data || next.data?.result || next.result || next.data || next;
        if (target) {
          const count = parseLikesCount(target.likes);
          target.likes = currentLikedStatus ? Math.max(0, count - 1) : count + 1;
          target.isLiked = !currentLikedStatus;
        }
        return next;
      });
      return { previousLp };
    },
    onError: (err, currentLikedStatus) => {
      if (err.response?.status === 409) {
        // 이미 서버 상태가 반대이므로 UI는 반전된 채로 유지
        setLocalIsLiked(!currentLikedStatus); 
      } else {
        setLocalIsLiked(currentLikedStatus);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpid] });
    },
  });

  // --- 3. 무한 스크롤 댓글 페칭 (복구 완료) ---
  const { 
    data: commentData, 
    isLoading: commentLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpid, order],
    queryFn: ({ pageParam }) => getLpComments({ lpid, cursor: pageParam, order, limit: 8 }),
    getNextPageParam: (lastPage) => lastPage.data?.nextCursor || lastPage.nextCursor || undefined,
    enabled: !!lpid,
  });

  const commentList = useMemo(() => {
    const pages = commentData?.pages ?? [];
    return pages.flatMap(p => {
      const arr = p.data?.comments || p.data?.result || p.result || p.data || p;
      return Array.isArray(arr) ? arr : [];
    }).map((c, i) => ({
      id: c.id || c.commentId || i,
      author: typeof c.author === 'object' ? (c.author.name || c.author.nickname || '익명') : (c.author || '익명'),
      content: c.content || '',
      createdAt: c.createdAt || new Date(),
    }));
  }, [commentData]);

  // --- 4. 댓글 등록 Mutation (복구 완료) ---
  const createCommentMutation = useMutation({
    mutationFn: (content) => postComment(lpid, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid, order] });
      setCommentText('');
    },
  });

  // 무한 스크롤 감지
  useEffect(() => {
    if (!commentsEndRef.current || !hasNextPage) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !isFetchingNextPage) fetchNextPage();
    }, { rootMargin: '200px' });
    obs.observe(commentsEndRef.current);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">데이터 로딩 중...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* LP 정보 카드 */}
          <section className="rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
            <img src={lp?.thumbnail} className="w-full rounded-[2rem] mb-8 shadow-xl" alt="" />
            <h2 className="text-4xl font-black mb-4 tracking-tight">{lp?.title}</h2>
            <div className="flex items-center gap-4 text-pink-500 font-bold text-xl mb-6">
              ❤️ {parseLikesCount(lp?.likes)}명이 응원 중
            </div>
            <p className="text-zinc-400 bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 leading-relaxed italic">
              "{lp?.content}"
            </p>
          </section>

          {/* 좋아요 버튼 섹션 */}
          <section>
            <div className="rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-8 sticky top-10 shadow-2xl">
              <h2 className="text-xl font-bold mb-8 text-zinc-600 tracking-widest uppercase">My Action</h2>
              
              <button 
                onClick={() => likeMutation.mutate(!!lp?.isLiked)}
                disabled={likeMutation.isPending}
                className={`w-full rounded-2xl border py-6 text-xl font-black transition-all duration-300 transform active:scale-90 ${
                  lp?.isLiked 
                  ? 'border-pink-600 bg-pink-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.4)]' 
                  : 'border-zinc-700 bg-zinc-900 text-zinc-500 hover:border-pink-600 hover:text-pink-600'
                }`}
              >
                {lp?.isLiked ? '💖 좋아요 해제' : '🤍 좋아요 누르기'}
              </button>
            </div>
          </section>
        </div>

        {/* 댓글 섹션 (전체 복구) */}
        <section className="rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black">COMMENTS <span className="text-pink-600 text-xl ml-2">{commentList.length}</span></h3>
            
            {/* 정렬 버튼 */}
            <div className="inline-flex rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
              <button 
                onClick={() => setSearchParams({ order: 'desc' })}
                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all ${order === 'desc' ? 'bg-pink-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                최신순
              </button>
              <button 
                onClick={() => setSearchParams({ order: 'asc' })}
                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all ${order === 'asc' ? 'bg-pink-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                과거순
              </button>
            </div>
          </div>
          
          {/* 댓글 입력 폼 */}
          <form className="mb-12 space-y-4" onSubmit={(e) => { 
            e.preventDefault(); 
            if(commentText.trim()) createCommentMutation.mutate(commentText); 
          }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-white focus:border-pink-500 transition-all outline-none resize-none"
              placeholder="아티스트에게 따뜻한 한마디를 남겨주세요."
              rows={3}
            />
            <div className="flex justify-end">
              <button 
                disabled={!commentText.trim() || createCommentMutation.isPending}
                className="rounded-2xl bg-pink-600 px-12 py-4 font-black hover:bg-pink-700 transition-all shadow-lg shadow-pink-900/30 disabled:bg-zinc-800"
              >
                {createCommentMutation.isPending ? '등록 중...' : '댓글 등록'}
              </button>
            </div>
          </form>

          {/* 댓글 목록 */}
          <div className="grid gap-6">
            {commentLoading ? (
               <div className="text-center py-10 text-zinc-600">댓글 로딩 중...</div>
            ) : commentList.length === 0 ? (
               <div className="text-center py-20 text-zinc-600 border border-dashed border-zinc-800 rounded-3xl">첫 번째 댓글을 남겨보세요! 🥊</div>
            ) : (
              commentList.map((c) => (
                <div key={c.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6 hover:bg-zinc-900/40 transition-all group">
                  <div className="flex justify-between mb-3">
                    <span className="font-bold text-pink-500 group-hover:text-pink-400 transition-colors">{c.author}</span>
                    <span className="text-xs text-zinc-600 tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{c.content}</p>
                </div>
              ))
            )}
            <div ref={commentsEndRef} className="h-10" />
            {isFetchingNextPage && <div className="text-center py-4 text-pink-600 animate-pulse">추가 댓글 불러오는 중...</div>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LpDetailPage; 