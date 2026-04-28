import clsx from 'clsx';
import { THEME, useTheme } from './context/ThemeProvider';

export default function ThemeContent() {
    const { theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return (
        <div
            className={clsx(
                'w-full h-64 flex flex-col justify-center px-4 gap-2',
                isLightMode ? 'bg-white' : 'bg-gray-800'
            )}
        >
            <h1
                className={clsx(
                    'text-wxl font-bold',
                    isLightMode ? 'text-black' : 'text-white'
                )}
            >
                Theme Content
            </h1>
            <p className={clsx(isLightMode ? 'text-black' : 'text-white')}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius. Sed at ligula a enim efficitur commodo. Curabitur ac odio id nisl convallis tincidunt. In hac habitasse platea dictumst.
            </p>
        </div>
    );
}