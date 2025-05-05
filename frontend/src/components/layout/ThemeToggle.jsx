import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Renders a button that toggles between light and dark themes.
 *
 * The button displays an icon and accessible label that reflect the current theme, allowing users to switch modes interactively.
 *
 * @returns {JSX.Element} A button for toggling the application's theme.
 */
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
}