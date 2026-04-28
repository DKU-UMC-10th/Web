import { useCallback } from "react";

type SetValue<T> = (value: T | ((prev: T | null) => T | null)) => void;
type ValueOrUpdater<T> = T | ((prev: T | null) => T | null);

const isUpdater = <T,>(value: ValueOrUpdater<T>): value is (prev: T | null) => T | null =>
    typeof value === "function";

function useLocalStorage<T>(key: string) {
    const getValue = useCallback((): T | null => {
        try {
            const item = localStorage.getItem(key);

            return item ? (JSON.parse(item) as T) : null;
        } catch {
            return null;
        }
    }, [key]);

    const setValue: SetValue<T> = useCallback(
        (value) => {
            const nextValue = isUpdater(value) ? value(getValue()) : value;

            if (nextValue === null) {
                localStorage.removeItem(key);
                return;
            }

            localStorage.setItem(key, JSON.stringify(nextValue));
        },
        [getValue, key],
    );

    const removeValue = useCallback(() => {
        localStorage.removeItem(key);
    }, [key]);

    return { getValue, setValue, removeValue };
}

export default useLocalStorage;