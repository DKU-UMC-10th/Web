import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useThrottle } from '../hooks/useThrottle';
import axios from 'axios';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [scrollTrigger, setScrollTrigger] = useState(0);
  
  // 🥊 [8-2 조건] 3초(3000ms) 주기로 쓰로틀링 제어
  const throttledScroll = useThrottle(scrollTrigger, 3000);

  // 실시간 스크롤 감지 횟수를 콘솔에 증명하기 위한 독립 카운터 (useRef로 렌더링 무관하게 추적)
  const realTimeScrollCount = useRef(0);
  const throttlePassCount = useRef(0);

  // 리액트 쿼리 무한 스크롤 연계
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: async ({ pageParam = 1 }) => {
      if (!query.trim()) return { result: [], nextPage: undefined };
      const response = await axios.get(`/v1/lps?search=${query}&page=${pageParam}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage || undefined;
    },
    enabled: query.trim() !== '',
    staleTime: 1000 * 60 * 5,
  });

  // 🥊 [쓰로틀 통과 구간] 3초 주기가 지나 쓰로틀이 풀렸을 때만 이 안으로 들어옵니다.
  useEffect(() => {
    if (throttledScroll > 0) {
      throttlePassCount.current += 1;
      
      // 쓰로틀 통과 시점 콘솔 로그 출력 (3초마다 딱 한 번씩만 묵직하게 출력됨)
      console.log(
        `⏱️ [useThrottle 통과] 현재까지 실시간 스크롤 총 [${realTimeScrollCount.current}번] 감지 중, 데이터 호출은 딱 [${throttlePassCount.current}번째] 실행!`
      );

      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [throttledScroll]);

  // 사용자가 스크롤을 내릴 때 바닥 감지 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      // 스크롤이 화면 바닥 근처(150px)에 도달했는지 확인
      if (scrollHeight - scrollTop <= clientHeight + 150) {
        realTimeScrollCount.current += 1;
        
        // 사용자가 스크롤을 드르륵 비빌 때 실시간으로 미친 듯이 찍히는 콘솔 로그
        console.log(`🏃 [실시간 스크롤 감지] 바닥 터치! 카운트: ${realTimeScrollCount.current}번`);
        
        // 쓰로틀 훅을 깨우기 위한 트리거 상태 업데이트
        setScrollTrigger(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="p-6 min-h-[160vh]">
      {/* 화면에 노출되는 깔끔한 최소 기능 검색창 */}
      <div>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="검색어를 입력하세요."
          className="w-full max-w-md p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
        />
      </div>
    </div>
  );
}