import { useCallback, useEffect, useState } from "react";

export const useSidebar = (initialOpen = false) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                close();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [close, isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const shouldLockScroll = window.matchMedia("(max-width: 1023px)").matches;

        if (!shouldLockScroll) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    return { isOpen, open, close, toggle };
};
