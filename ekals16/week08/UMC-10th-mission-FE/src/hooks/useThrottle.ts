import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, interval: number) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecutedAt = useRef(Date.now());
  const timerId = useRef<number | null>(null);

  useEffect(() => {
    const elapsedTime = Date.now() - lastExecutedAt.current;
    const remainingTime = interval - elapsedTime;

    if (remainingTime <= 0) {
      if (timerId.current !== null) {
        window.clearTimeout(timerId.current);
        timerId.current = null;
      }

      setThrottledValue(value);
      lastExecutedAt.current = Date.now();
      return;
    }

    timerId.current = window.setTimeout(() => {
      setThrottledValue(value);
      lastExecutedAt.current = Date.now();
      timerId.current = null;
    }, remainingTime);

    return () => {
      if (timerId.current !== null) {
        window.clearTimeout(timerId.current);
        timerId.current = null;
      }
    };
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;
