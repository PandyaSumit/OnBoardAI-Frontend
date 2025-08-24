import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import AIAgentViewPanel from './pages/AiWorkflow';
import LandingPage from './pages/LandingPage';

function App() {
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
