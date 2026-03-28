import ThemeToggleButton from './ThemeToggleButton';
import { THEME, useTheme } from './context/theme-context';

export default function Navbar() {
    const { theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return (
        <nav
            className={`flex w-full justify-start p-4 transition-colors ${
                isLightMode ? 'bg-gray-100' : 'bg-gray-800'
            }`}
        >
            <ThemeToggleButton />
        </nav>
    );
}