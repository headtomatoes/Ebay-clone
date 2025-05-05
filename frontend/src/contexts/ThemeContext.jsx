import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

/**
 * Returns the current theme context value, including the theme mode and a function to toggle it.
 *
 * @returns {{ theme: 'light' | 'dark', toggleTheme: () => void }} The current theme and a function to switch themes.
 */
export function useTheme() {
    return useContext(ThemeContext);
}

/****
 * Provides theme state and a toggle function to descendant components via React context.
 *
 * Initializes the theme from local storage or defaults to 'light', and updates both the state and local storage when toggled. Applies or removes the 'dark' CSS class on the root HTML element based on the current theme.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Components that will have access to the theme context.
 */
export function ThemeProvider({ children }) {
    // Check if theme is saved in local storage or use 'light' as default
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    // Apply theme class to HTML element whenever theme changes
    useEffect(() => {
        const htmlElement = document.documentElement;

        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    }, [theme]);

    const value = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}