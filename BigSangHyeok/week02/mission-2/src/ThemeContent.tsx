import { THEME, useTheme } from './context/theme-context';

export default function ThemeContent() {
    const { theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return (
        <div
            className={`w-full min-h-[calc(100vh-80px)] p-8 transition-colors ${
                isLightMode ? 'bg-white' : 'bg-gray-900'
            }`}
        >
            <h1
                className={`text-3xl font-bold ${
                    isLightMode ? 'text-black' : 'text-white'
                }`}
            >
                Theme Content
            </h1>
            <p className={`mt-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                현재 테마는 {isLightMode ? '라이트 모드' : '다크 모드'}입니다.
            </p>
        </div>
    );
}