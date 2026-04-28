import { THEME, useTheme } from './context/theme-context';

export default function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return (
        <button
            onClick={toggleTheme}
            className={`rounded-md px-4 py-2 transition-colors ${
                isLightMode
                    ? 'bg-gray-900 text-white hover:bg-black'
                    : 'bg-white text-gray-900 hover:bg-gray-200'
            }`}
        >
            {isLightMode ? '다크 모드' : '라이트 모드'}
        </button>
    );
}