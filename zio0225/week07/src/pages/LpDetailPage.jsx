import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLpDetail, getLpComments } from '../api/lpApi';
import { postComment } from '../api/CommentApi';
import api from '../api/axios';

const LpDetailPage = () => {
  const { lpid } = useParams();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [commentText, setCommentText] = useState('');
  
  // 🥊 핵심: 서버 데이터와 별개로 버튼 UI를 즉각 제어하기 위한 로컬 상태
  const [localIsLiked, setLocalIsLiked] = useState(null);
  
  const commentsEndRef = useRef(null);
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  // --- 데이터 페칭 ---
  const { data, isLoading } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpDetail(lpid),
    enabled: !!lpid,
    // 서버에서 데이터를 새로 가져오면 로컬 상태도 동기화
    onSuccess: (res) => {
      const actualData = res?.data?.data || res?.data?.result || res?.result || res?.data || res;
      setLocalIsLiked(!!actualData?.isLiked);
    }
  });

  const lp = useMemo(() => {
    const raw = data?.data?.data || data?.data?.result || data?.result || data?.data || data;
    if (!raw) return null;
    // 🥊 UI는 서버의 isLiked보다 로컬 상태(localIsLiked)를 우선적으로 따름
    return { ...raw, isLiked: localIsLiked ?? !!raw.isLiked };
  }, [data, localIsLiked]);

  const parseLikesCount = (likes) => {
    if (typeof likes === 'number') return likes;
    if (Array.isArray(likes)) return likes.length;
    return Number(likes?.count ?? likes?.total ?? likes ?? 0);
  };

  // --- 좋아요 Mutation (강력한 UI 반전 로직 🥊) ---
  const likeMutation = useMutation({
    mutationFn: async (isLiked) => {
      if (isLiked) return await api.delete(`/v1/lps/${lpid}/likes`);
      return await api.post(`/v1/lps/${lpid}/likes`);
    },
    onMutate: async (currentLikedStatus) => {
      // 1. 즉시 UI를 반전 (로컬 상태 업데이트)
      setLocalIsLiked(!currentLikedStatus);

      await queryClient.cancelQueries({ queryKey: ['lp', lpid] });
      const previousLp = queryClient.getQueryData(['lp', lpid]);
      
      // 2. 캐시 데이터도 업데이트 (좋아요 숫자 조절)
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
      // 🥊 409 Conflict 발생해도 버튼은 '반대 상태'로 고정
      if (err.response?.status === 409) {
        console.warn("Conflict 발생: UI를 서버 상태에 맞춰 강제 고정합니다.");
        setLocalIsLiked(!currentLikedStatus); 
      } else {
        // 진짜 네트워크 에러면 원래대로 복구
        setLocalIsLiked(currentLikedStatus);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpid] });
    },
  });

  // --- 댓글 로직 (기존과 동일) ---
  const { data: commentData, isLoading: commentLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['lpComments', lpid, order],
    queryFn: ({ pageParam }) => getLpComments({ lpid, cursor: pageParam, order, limit: 8 }),
    getNextPageParam: (last) => last.data?.nextCursor || undefined,
  });

  const commentList = useMemo(() => {
    const pages = commentData?.pages ?? [];
    return pages.flatMap(p => {
      const arr = p.data?.comments || p.data?.result || p.result || p.data || p;
      return Array.isArray(arr) ? arr : [];
    }).map((c, i) => ({
      id: c.id || c.commentId || i,
      author: typeof c.author === 'object' ? (c.author.name || '익명') : (c.author || '익명'),
      content: c.content || '',
      createdAt: c.createdAt || new Date(),
    }));
  }, [commentData]);

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* 아티스트 카드 */}
          <section className="rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-8">
            <img src={lp?.thumbnail} className="w-full rounded-[2rem] mb-8 shadow-2xl" alt="" />
            <h2 className="text-4xl font-black mb-4 tracking-tight">{lp?.title}</h2>
            <div className="text-pink-500 font-bold text-xl mb-6">❤️ {parseLikesCount(lp?.likes)}</div>
            <p className="text-zinc-400 leading-relaxed bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800">{lp?.content}</p>
          </section>

          {/* 🥊 좋아요 버튼 섹션 (localIsLiked에 따라 즉각 반응) */}
          <section>
            <div className="rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-8 sticky top-10">
              <h2 className="text-xl font-bold mb-8 text-zinc-600">ACTION</h2>
              <button 
                onClick={() => likeMutation.mutate(!!lp?.isLiked)}
                disabled={likeMutation.isPending}
                className={`w-full rounded-2xl border py-6 text-xl font-black transition-all duration-300 active:scale-95 ${
                  lp?.isLiked 
                  ? 'border-pink-600 bg-pink-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.4)]' 
                  : 'border-zinc-700 bg-zinc-900 text-zinc-500 hover:border-pink-600'
                }`}
              >
                {lp?.isLiked ? '💖 좋아요 해제' : '🤍 좋아요 누르기'}
              </button>
            </div>
          </section>
        </div>

        {/* 댓글 (생략 가능하지만 완성도를 위해 유지) */}
        <section className="rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-8">
          <h3 className="text-2xl font-bold mb-8">Comments ({commentList.length})</h3>
          <div className="space-y-4">
            {commentList.map(c => (
              <div key={c.id} className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800">
                <p className="text-pink-500 font-bold text-sm mb-2">{c.author}</p>
                <p className="text-zinc-300">{c.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LpDetailPage;