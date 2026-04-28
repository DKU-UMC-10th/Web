import { useTheme } from './ThemeProvider';

export const ThemeToggleButton = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 rounded-lg font-bold transition-all bg-blue-500 text-white hover:bg-blue-600 shadow-md"
    >
      {isDarkMode ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
    </button>
  );
};