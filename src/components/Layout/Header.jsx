import React, { useState, useRef, useEffect } from 'react';
import {
    Moon,
    Sun,
    Bell,
    LogOut,
    Settings,
    User,
    ChevronDown,
    Search,
    X,
    Command,
    Menu
} from 'lucide-react';
import useDarkMode from '../../utils/useDarkMode';

const Header = ({ toggleSidebar, toggleMobileSidebar, sidebarOpen }) => {
    const [theme, toggleTheme] = useDarkMode();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationCount, setNotificationCount] = useState(3);
    const dropdownRef = useRef();
    const searchRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
                setTimeout(() => {
                    searchRef.current?.querySelector('input')?.focus();
                }, 100);
            }
            if (e.key === 'Escape' && searchOpen) {
                setSearchOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [searchOpen]);

    const handleNotificationClick = () => {
        setNotificationCount(0);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Search query:', searchQuery);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        searchRef.current?.querySelector('input')?.focus();
    };

    const searchSuggestions = [
        { type: 'recent', text: 'Employee onboarding', icon: '🔍' },
        { type: 'recent', text: 'Training modules', icon: '🔍' },
        { type: 'suggestion', text: 'Dashboard analytics', icon: '📊' },
        { type: 'suggestion', text: 'User management', icon: '👥' },
        { type: 'suggestion', text: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <header className="w-full sticky top-0 z-50 bg-white/60 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700 h-14">
                <div className="flex items-center justify-between px-5 py-3 h-full">
                    {/* Left Section - Logo with Sidebar Toggle */}
                    <div className="flex items-center gap-3">
                        {/* Sidebar Toggle Button - Desktop */}
                        <button
                            onClick={toggleSidebar}
                            className="hidden lg:flex p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                        >
                            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>

                        {/* Mobile Sidebar Toggle */}
                        <button
                            onClick={toggleMobileSidebar}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Toggle Menu"
                        >
                            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>

                        {/* Logo */}
                        <div className="flex items-center space-x-1 text-lg font-semibold">
                            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF0080] bg-clip-text text-transparent">
                                Onboard
                            </span>
                            <span className="text-gray-800 dark:text-gray-100">AI</span>
                        </div>
                    </div>

                    {/* Center - Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4" ref={searchRef}>
                        <div className="relative w-full">
                            <form onSubmit={handleSearchSubmit} className="w-full">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setSearchOpen(true)}
                                        placeholder="Search anything..."
                                        className="w-full pl-10 pr-20 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300/40 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        {searchQuery && (
                                            <button type="button" onClick={clearSearch} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                                <X size={12} className="text-gray-400" />
                                            </button>
                                        )}
                                        <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                                            <Command size={10} />
                                            K
                                        </span>
                                    </div>
                                </div>
                            </form>

                            {searchOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-md z-50 p-3">
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                        {searchQuery ? 'Results' : 'Recent Searches'}
                                    </div>
                                    {searchSuggestions
                                        .filter(s => !searchQuery || s.text.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSearchQuery(item.text);
                                                    setSearchOpen(false);
                                                }}
                                                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{item.icon}</span>
                                                    {item.text}
                                                </div>
                                                {item.type === 'recent' && (
                                                    <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Recent</span>
                                                )}
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section - Controls */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="text-yellow-400 transition-transform duration-200 hover:rotate-12" size={20} />
                            ) : (
                                <Moon className="text-gray-700 dark:text-gray-300 transition-transform duration-200 hover:-rotate-12" size={20} />
                            )}
                        </button>

                        {/* Notifications */}
                        <button
                            onClick={handleNotificationClick}
                            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            aria-label="Notifications"
                        >
                            <Bell className="text-gray-700 dark:text-gray-300" size={20} />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white font-bold rounded-full shadow-sm">
                                    {notificationCount}
                                </span>
                            )}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold rounded-md shadow">
                                    SP
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-600 dark:text-gray-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {dropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-60 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden animate-fade-in-up">
                                        {/* Profile Info */}
                                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold rounded-md">
                                                SP
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-semibold text-gray-900 dark:text-white">Sarah Parker</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">sarah@onboardai.com</p>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2 text-sm">
                                            <MenuItem icon={<User size={16} />} text="My Profile" />
                                            <MenuItem icon={<Settings size={16} />} text="Settings" />
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            <MenuItem icon={<LogOut size={16} />} text="Logout" isLogout />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

const MenuItem = ({ icon, text, isLogout = false }) => (
    <button
        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-all duration-150 
    hover:bg-gray-100 dark:hover:bg-gray-700 ${isLogout ? 'text-red-600 dark:text-red-400 hover:text-red-700' : 'text-gray-700 dark:text-gray-300'}`}
    >
        <span className={`${isLogout ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>{icon}</span>
        <span className="font-medium">{text}</span>
    </button>
);

export default Header;