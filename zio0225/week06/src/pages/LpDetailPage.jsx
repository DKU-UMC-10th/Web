import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../api/lpApi'; // 🥊 아까 만든 상세 조회 API

const LpDetailPage = () => {
  const { lpid } = useParams(); // URL에서 id 추출 ㅡㅡ
  const navigate = useNavigate();

  // 🥊 핵심: queryKey에 lpid를 포함해서 다른 LP를 클릭할 때마다 새로 패칭!
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

  const lp = getLpData(data);

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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 1. 왼쪽: 썸네일 섹션 🥊 */}
          <section className="flex-1">
            <img 
              src={lp?.thumbnail} 
              alt={lp?.title} 
              className="w-full max-w-md mx-auto lg:mx-0 rounded-3xl shadow-2xl shadow-black/40" 
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'https://placehold.co/400x400/1f2937/ffffff?text=NO+IMAGE';
              }}
            />
          </section>

          {/* 2. 오른쪽: 정보 섹션 ㅡㅡ */}
          <section className="flex-1 space-y-6">
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-lg shadow-black/20">
              <div className="mb-4">
                <h2 className="text-4xl font-bold text-pink-500">{lp?.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">{new Date(lp?.createdAt || lp?.publishedAt || Date.now()).toLocaleDateString()} · 좋아요 {lp?.likes || 0}</p>
              </div>
              <div className="space-y-4 text-zinc-300">
                <p className="text-base leading-relaxed">{lp?.content || '본문 내용이 없습니다.'}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="flex-1 px-5 py-3 bg-pink-600 text-white rounded-2xl font-semibold hover:bg-pink-700 transition-colors">좋아요</button>
              <button className="flex-1 px-5 py-3 bg-zinc-800 text-zinc-200 rounded-2xl hover:bg-zinc-700 transition-colors">수정</button>
              <button className="flex-1 px-5 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors">삭제</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;