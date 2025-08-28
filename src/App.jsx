import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import AIAgentViewPanel from './pages/AiWorkflow';
import LandingPage from './pages/LandingPage';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCurrentUser, refreshToken } from './store/slices/authSlice';

function App() {

    const dispatch = useDispatch()
    useEffect(() => {
        // Try to refresh token if we have one in cookie
        dispatch(refreshToken())
            .unwrap()
            .then(() => {
                dispatch(getCurrentUser());
            })
            .catch(() => {
                console.log("No valid session, redirecting to login");
            });
    }, [dispatch]);

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
