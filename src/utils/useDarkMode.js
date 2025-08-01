import { useEffect, useState } from 'react';

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) return storedTheme;
        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (userMedia.matches) return 'dark';
    }
    return 'light';
};

const useDarkMode = () => {
    const [theme, setTheme] = useState(getInitialTheme);

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
