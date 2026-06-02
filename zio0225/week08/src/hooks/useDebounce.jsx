import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // [ ] 지연 시간(delay) 후에 값을 업데이트하는 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // [ ] 언마운트 / 의존성 변경 시 타이머를 깨끗하게 정리 (clearTimeout)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // [ ] 값이나 지연 시간(delay) 변경이 즉시 반영되도록 의존성 배열 주입

  return debouncedValue;
}