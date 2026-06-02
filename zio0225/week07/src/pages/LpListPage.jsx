import { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../api/lpApi';
import SkeletonCard from '../components/SkeletonCard';
import CreateLpModal from '../components/modal/CreateLpModal';

const LpListPage = () => {
  const [order, setOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (location.pathname.includes('/new')) {
      navigate('/lps', { replace: true });
      setIsModalOpen(true);
    }
  }, [location.pathname, navigate]);

  const getLpArray = (payload) => {
    if (!payload) return [];
    // 모든 계층에서 배열 찾기
    const target = payload.data?.data || payload.data?.result || payload.result || payload.data || payload;
    return Array.isArray(target) ? target : [];
  };

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['lps', order, search],
    queryFn: ({ pageParam }) => getLpList({ order, search, cursor: pageParam, limit: 12 }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || undefined,
    staleTime: 1000 * 60 * 5,
  });

  const lpList = useMemo(() => {
    const pages = data?.pages ?? [];
    const raw = pages.flatMap(getLpArray);
    return raw.map((item) => {
      // 🥊 [에러 해결 핵심] likes가 객체 {id, userId...}로 들어오면 숫자로 강제 변환
      let safeLikes = item.likes;
      if (typeof safeLikes === 'object' && safeLikes !== null) {
        safeLikes = 0; // 객체면 일단 0으로 처리
      } else {
        safeLikes = Number(safeLikes) || 0;
      }

      return {
        id: item.id || item.lpId,
        title: item.title || item.name || '제목 없음',
        thumbnail: item.thumbnail || 'https://placehold.co/400x400/1f2937/ffffff?text=NO+IMAGE',
        likes: safeLikes,
        createdAt: item.createdAt || new Date().toISOString(),
      };
    });
  }, [data]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { rootMargin: '200px' });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <div className="min-h-screen bg-black p-6"><div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto"><SkeletonCard count={12} /></div></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">LP 컬렉션</h1>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
          {lpList.map((lp) => (
            <div key={lp.id} onClick={() => navigate(`/lp/${lp.id}`)} className="group cursor-pointer overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 hover:border-pink-600 transition-all">
              <div className="relative aspect-square">
                <img src={lp.thumbnail} alt={lp.title} className="h-full w-full object-cover" />
                <div className="absolute inset-x-4 bottom-4">
                  {/* 🥊 이제 여기서 에러 안 남! */}
                  <p className="text-xs text-zinc-400">좋아요 {lp.likes}</p>
                  <h2 className="text-xl font-semibold truncate">{lp.title}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={loadMoreRef} className="h-20" />
      </div>
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-10 right-10 h-16 w-16 rounded-full bg-pink-600 text-3xl">+</button>
      <CreateLpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LpListPage;