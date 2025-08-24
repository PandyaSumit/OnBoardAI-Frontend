import { useEffect, useState } from 'react';

const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';

    // Get the theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const useDarkMode = () => {
    // Use a lazy initial state to avoid hydration mismatch
    const [theme, setTheme] = useState(() => {
        // Return the current class state on first render to match SSR/initial load
        if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
            return 'dark';
        }
        return getInitialTheme();
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return [theme, toggleTheme];
};

export default useDarkMode;
