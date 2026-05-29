import { useEffect, useRef, useState } from "react";

const useThrottle = <T,>(value: T, interval: number) => {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastExecutedAtRef = useRef(Date.now());
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const now = Date.now();
        const elapsedTime = now - lastExecutedAtRef.current;
        const remainingTime = interval - elapsedTime;

        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (remainingTime <= 0) {
            console.log("throttle 즉시 실행", value);
            setThrottledValue(value);
            lastExecutedAtRef.current = now;
            return;
        }

        console.log(`throttle 대기 중: ${remainingTime}ms 뒤 실행`);
        timerRef.current = window.setTimeout(() => {
            console.log("throttle 지연 실행", value);
            setThrottledValue(value);
            lastExecutedAtRef.current = Date.now();
            timerRef.current = null;
        }, remainingTime);

        return () => {
            if (timerRef.current) {
                console.log("throttle 타이머 정리 (clearTimeout)");
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [value, interval]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    return throttledValue;
};

export default useThrottle;
