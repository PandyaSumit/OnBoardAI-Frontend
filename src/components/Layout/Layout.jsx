import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Pages where we don't want Header and Sidebar
    const authPages = ['/', '/organization-auth', '/employee-auth'];
    const isAuthPage = authPages.includes(location.pathname);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(prev => !prev);
    };

    // If it's an auth page, render only the Outlet without Header/Sidebar
    if (isAuthPage) {
        return (
            <div className="min-h-screen">
                <Outlet />
            </div>
        );
    }

    // For dashboard and other pages, render with Header/Sidebar
    return (
        <div className="flex h-screen overflow-hidden dark:bg-gray-900 text-gray-800 dark:text-white">
            <Sidebar
                isOpen={sidebarOpen}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
            <div className="flex flex-col flex-1 min-w-0">
                <Header
                    toggleSidebar={toggleSidebar}
                    toggleMobileSidebar={toggleMobileSidebar}
                    sidebarOpen={sidebarOpen}
                    mobileOpen={mobileOpen}
                />

                <main
                    className={`flex-1 overflow-auto bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}
                >
                    <div className="w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;