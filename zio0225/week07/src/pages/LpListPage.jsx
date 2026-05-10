import { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 👈 useLocation 추가
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../api/lpApi';
import SkeletonCard from '../components/SkeletonCard';
import CreateLpModal from '../components/modal/CreateLpModal';

const LpListPage = () => {
  const [order, setOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 현재 주소 감시용
  const loadMoreRef = useRef(null);

  // 🚨 [긴급 조치] 주소창에 /new가 붙으면 즉시 제거하고 모달만 띄움
  useEffect(() => {
    if (location.pathname.includes('/new')) {
      navigate('/lps', { replace: true }); // 주소창에서 /new 삭제
      setIsModalOpen(true); // 대신 모달을 띄움
    }
  }, [location.pathname, navigate]);

  // --- [지오님 원본 로직 유지 시작] ---
  const getNextCursor = (payload) => {
    if (!payload) return undefined;
    return (
      payload.nextCursor ?? payload.cursor ?? payload.data?.nextCursor ?? 
      payload.data?.cursor ?? payload.data?.pagination?.nextCursor ?? 
      payload.data?.pagination?.cursor ?? payload.result?.nextCursor ?? 
      payload.result?.cursor ?? payload.result?.pagination?.nextCursor ?? 
      payload.result?.pagination?.cursor ?? undefined
    );
  };

  const {
    data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', order, search],
    queryFn: ({ pageParam }) => getLpList({ order, search, cursor: pageParam, limit: 12 }),
    getNextPageParam: (lastPage) => getNextCursor(lastPage),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const getLpArray = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.result)) return payload.result;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.lps)) return payload.lps;
    if (Array.isArray(payload.data?.data)) return payload.data.data;
    if (Array.isArray(payload.data?.result)) return payload.data.result;
    if (Array.isArray(payload.data?.lps)) return payload.data.lps;
    if (Array.isArray(payload.result?.data)) return payload.result.data;
    if (Array.isArray(payload.data?.items)) return payload.data.items;
    if (Array.isArray(payload.result?.items)) return payload.result.items;
    return [];
  };

  const lpList = useMemo(() => {
    const pages = data?.pages ?? [];
    const raw = pages.flatMap(getLpArray);
    return raw.map((item) => ({
      id: item.id,
      title: item.title || item.name || '제목 없음',
      thumbnail: item.thumbnail || item.thumnail || item.img || 'https://placehold.co/400x400/1f2937/ffffff?text=NO+IMAGE',
      likes: item.likes ?? 0,
      createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    }));
  }, [data]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  // --- [지오님 원본 로직 유지 끝] ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          <SkeletonCard count={12} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <p className="text-red-500 mb-4">데이터를 가져오지 못했어요: {error.message} 🥊</p>
        <button onClick={() => refetch()} className="px-6 py-2 bg-pink-600 rounded-lg">다시 시도</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">LP 컬렉션</h1>
            <p className="mt-2 text-sm text-zinc-400">당신의 음악 취향을 공유해 보세요.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 py-1.5 px-2">
              <button onClick={() => setOrder('desc')} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${order === 'desc' ? 'bg-pink-600 text-white' : 'text-zinc-300'}`}>최신순</button>
              <button onClick={() => setOrder('asc')} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${order === 'asc' ? 'bg-pink-600 text-white' : 'text-zinc-300'}`}>오래된순</button>
            </div>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="검색어 입력" className="rounded-full border border-zinc-800 bg-zinc-950 py-2 px-4 text-sm outline-none focus:border-pink-500" />
          </div>
        </div>

        {lpList.length === 0 ? (
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-400">검색 결과가 없습니다.</div>
        ) : (
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
            {lpList.map((lp) => (
              <div key={lp.id} onClick={() => navigate(`/lp/${lp.id}`)} className="group cursor-pointer overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 hover:border-pink-600 transition-all">
                <div className="relative aspect-square overflow-hidden bg-zinc-900">
                  <img src={lp.thumbnail} alt={lp.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <p className="text-xs uppercase tracking-widest text-zinc-400">좋아요 {lp.likes}</p>
                    <h2 className="mt-2 text-xl font-semibold line-clamp-2">{lp.title}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={loadMoreRef} className="h-20" />
      </div>

      {/* 🚀 플로팅 버튼: navigate 절대 금지 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-pink-600 text-white shadow-2xl hover:scale-110 active:scale-95 text-4xl"
      >
        +
      </button>

      <CreateLpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LpListPage;