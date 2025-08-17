import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import RoleSelection from './pages/auth/RoleSelection';
import OrganizationAuth from './pages/auth/OrganizationAuth';
import EmployeeAuth from './pages/auth/EmployeeAuth';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Public Routes */}
                    <Route element={<PublicRoute />}>
                        <Route index element={<RoleSelection />} />
                        <Route path="organization-auth" element={<OrganizationAuth />} />
                        <Route path="employee-auth" element={<EmployeeAuth />} />
                    </Route>

                    {/* Private Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
