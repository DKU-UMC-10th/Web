import { useState, useEffect, useRef } from 'react';

// 제네릭 형태로 어떤 타입의 value든 다룰 수 있도록 구현
export function useThrottle(value, interval = 1000) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    const now = Date.now();
    const remainingMode = interval - (now - lastExecuted.current);

    if (remainingMode <= 0) {
      // 대기 시간이 끝났으면 즉시 실행 및 플래그(시간) 업데이트
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      // 아직 주기가 안 지났으면 이전 타이머는 취소하고 새로 예약
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, remainingMode);
    }

    // [ ] 언마운트 / 의존성 변경 시 타이머 정리 (메모리 누수 방지)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, interval]);

  return throttledValue;
}