import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import AIAgentViewPanel from './pages/AiWorkflow';
import LandingPage from './pages/LandingPage';
import { initializeAuth } from './store/slices/authSlice';
import LoadingScreen from './components/LoadingScreen';

function App() {
    const dispatch = useDispatch();
    const { authInitialized, isInitializing, isAuthenticated, error } = useSelector(state => state.auth);
    const [appReady, setAppReady] = useState(false);
    const [minLoadingTime, setMinLoadingTime] = useState(false);

    useEffect(() => {
        // Set minimum loading time for smooth UX
        const minLoadingTimer = setTimeout(() => {
            setMinLoadingTime(true);
        }, 1000);

        return () => clearTimeout(minLoadingTimer);
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            try {
                console.log('App: Starting authentication initialization...');

                // Dispatch auth initialization
                const result = await dispatch(initializeAuth());

                if (initializeAuth.fulfilled.match(result)) {
                    console.log('App: Auth initialization successful');
                } else if (initializeAuth.rejected.match(result)) {
                    console.log('App: Auth initialization failed (user not authenticated)');
                    // This is expected when user is not logged in
                }
            } catch (error) {
                console.error('App: Auth initialization error:', error);
            }
        };

        // Only initialize once
        if (!authInitialized && !isInitializing) {
            initAuth();
        }
    }, [dispatch, authInitialized, isInitializing]);

    useEffect(() => {
        // App is ready when auth is initialized and minimum loading time has passed
        if (authInitialized && minLoadingTime) {
            console.log('App: Ready to render - Auth initialized:', authInitialized, 'Authenticated:', isAuthenticated);
            setAppReady(true);
        }
    }, [authInitialized, minLoadingTime, isAuthenticated]);

    // Show loading screen while app is not ready
    if (!appReady) {
        console.log('App: Showing loading screen - authInitialized:', authInitialized, 'minLoadingTime:', minLoadingTime);
        return <LoadingScreen />;
    }

    console.log('App: Rendering main app - isAuthenticated:', isAuthenticated);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Public Routes */}
                    <Route element={<PublicRoute />}>
                        <Route index element={<LandingPage />} />
                    </Route>

                    {/* Private Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="workflows" element={<AIAgentViewPanel />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;