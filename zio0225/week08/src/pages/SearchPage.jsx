import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  console.log(`🔥 입력값: [${query}] | ⏱️ 디바운스값: [${debouncedQuery}]`);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(`/v1/lps?search=${debouncedQuery}&page=${pageParam}`);
      return response.data; 
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage || undefined; 
    },
    enabled: debouncedQuery.trim() !== '',
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="검색어를 입력하세요."
          className="w-full max-w-md p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
        />
      </div>

      {/* 🚨 백엔드 데이터 구조 디버깅 영역: 화면 튕김을 막고 데이터를 텍스트로 강제 출력합니다. */}
      {data && (
        <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs overflow-auto max-h-40 text-green-400">
          <p className="font-bold text-white mb-2">💡 백엔드 응답 데이터 구조 확인:</p>
          <pre>{JSON.stringify(data.pages[0], null, 2)}</pre>
        </div>
      )}

      {/* 결과 렌더링 영역 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.pages.map((page, index) => {
          // 어떤 상황에서도 무조건 배열이 되도록 철저하게 안전장치
          let list = [];
          if (Array.isArray(page)) {
            list = page;
          } else if (page && typeof page === 'object') {
            list = page.data || page.result || page.lps || page.items || page.content || [];
            if (!Array.isArray(list)) {
              // 위 키값들로 안 잡히면 내부 속성 중 첫 번째 배열을 탐색
              const found = Object.values(page).find(v => Array.isArray(v));
              list = Array.isArray(found) ? found : [];
            }
          }

          // 최종 검사: 진짜 배열일 때만 map 실행 (절대 에러 안 남)
          if (!Array.isArray(list)) return null;

          return list.map((lp) => (
            <div key={lp.id || Math.random()} className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl flex flex-col gap-2">
              {lp.thumbnail && (
                <img src={lp.thumbnail} alt={lp.title} className="w-full aspect-square object-cover rounded-xl bg-zinc-900" />
              )}
              <h3 className="font-bold text-lg truncate mt-2">{lp.title || '제목 없음'}</h3>
              <p className="text-zinc-400 text-sm line-clamp-2 flex-1">{lp.content || '내용 없음'}</p>
            </div>
          ));
        })}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-3 bg-zinc-900 text-pink-500 rounded-xl font-bold">
            {isFetchingNextPage ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  );
}