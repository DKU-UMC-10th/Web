import { useEffect, useState } from "react";

const useDebounce = <T,>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        console.log("입력 중... debounce 타이머 설정");

        const timerId = window.setTimeout(() => {
            console.log("debounce 완료: 지연된 값 반영");
            setDebouncedValue(value);
        }, delay);

        return () => {
            console.log("이전 debounce 타이머 취소됨 (clearTimeout)");
            window.clearTimeout(timerId);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
