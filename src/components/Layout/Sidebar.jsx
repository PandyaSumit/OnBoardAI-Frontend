import {
    LayoutDashboard,
    Bot,
    BarChart3,
    Settings2,
    Settings,
    LifeBuoy,
    LogOut,
    X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, mobileOpen, setMobileOpen }) => {
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'AI Workflows', icon: Bot, path: '/workflows' },
        { label: 'Insights', icon: BarChart3, path: '/insights' },
        { label: 'Automations', icon: Settings2, path: '/automations' },
        { label: 'Settings', icon: Settings, path: '/settings' },
        { label: 'Help Center', icon: LifeBuoy, path: '/help' },
    ];

    const renderNavItems = () => (
        <nav className="flex-1 mt-6 px-2 space-y-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`group relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${isOpen ? 'justify-start' : 'justify-center'}
                        ${isActive
                                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-700/30 dark:text-indigo-300'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-800/20'}`}
                    >
                        {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
                        )}
                        <Icon size={20} className="shrink-0" />
                        <span
                            className={`ml-3 transition-all duration-200 origin-left
                            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'}`}
                        >
                            {item.label}
                        </span>
                        
                        {/* Tooltip for collapsed state */}
                        {!isOpen && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                {item.label}
                            </div>
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
                    fixed top-14 h-[calc(100vh-3.5rem)] left-0 z-40 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800
                    border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out
                    ${isOpen ? 'w-64' : 'w-20'} 
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0
                `}
            >
                {/* Mobile Close Button */}
                <div className="lg:hidden absolute top-4 right-4 z-50">
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                <div className="flex flex-col h-full justify-between">
                    {/* Nav Section */}
                    {renderNavItems()}

                    {/* Profile Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className={`flex items-center justify-between ${!isOpen ? 'flex-col gap-2' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow">
                                    SP
                                </div>
                                {isOpen && (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white">Sarah P.</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">sarah@onboardai.com</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;