import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLpList } from '../api/lpApi';

const LpListPage = () => {
  const [order, setOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['lps', order, search],
    queryFn: () => getLpList({ order, search }),
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
    const raw = getLpArray(data);

    return raw.map((item) => ({
      id: item.id,
      title: item.title || item.name || '제목 없음',
      thumbnail: item.thumbnail || item.thumnail || item.img || 'https://placehold.co/400x400/1f2937/ffffff?text=NO+IMAGE',
      likes: item.likes ?? 0,
      createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-72 rounded-[2rem] bg-zinc-900 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <p className="text-red-500 mb-4">데이터를 가져오지 못했어요: {error.message} 🥊</p>
        <button 
          onClick={() => refetch()} 
          className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">LP 컬렉션</h1>
            <p className="mt-2 text-sm text-zinc-400">실제 백엔드 /v1/lps API를 호출해 앨범 커버 스타일 그리드를 렌더링합니다.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 py-1.5 px-2">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${order === 'desc' ? 'bg-pink-600 text-white' : 'text-zinc-300 hover:text-white'}`}
                onClick={() => setOrder('desc')}
              >
                최신순
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${order === 'asc' ? 'bg-pink-600 text-white' : 'text-zinc-300 hover:text-white'}`}
                onClick={() => setOrder('asc')}
              >
                오래된순
              </button>
            </div>
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="검색어 입력"
                className="w-full rounded-full border border-zinc-800 bg-zinc-950 py-2 pl-4 pr-10 text-sm text-white outline-none transition focus:border-pink-500"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
            </div>
          </div>
        </div>

        {lpList.length === 0 ? (
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-400">
            검색 결과가 없습니다. 검색어를 변경해 보세요.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {lpList.map((lp) => (
              <div
                key={lp.id}
                className="group cursor-pointer overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-[0_30px_120px_-90px_rgba(255,255,255,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:border-pink-600"
                onClick={() => navigate(`/lp/${lp.id}`)}
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-900">
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = 'https://placehold.co/400x400/1f2937/ffffff?text=NO+IMAGE';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">좋아요 {lp.likes}</p>
                    <h2 className="mt-2 text-xl font-semibold leading-tight line-clamp-2">{lp.title}</h2>
                    <p className="mt-1 text-xs text-zinc-400">{new Date(lp.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LpListPage;