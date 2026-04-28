import { useMemo, useState, type PropsWithChildren } from 'react';
import { THEME, ThemeContext, type Theme } from './theme-context';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<Theme>(THEME.LIGHT);

    const toggleTheme = () => {
        setTheme((prevTheme) =>
            prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT,
        );
    };

    const value = useMemo(
        () => ({ theme, toggleTheme }),
        [theme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};