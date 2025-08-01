import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import RoleSelection from './pages/auth/RoleSelection';
import OrganizationAuth from './pages/auth/OrganizationAuth';
import EmployeeAuth from './pages/auth/EmployeeAuth';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<RoleSelection />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="organization-auth" element={<OrganizationAuth />} />
                    <Route path="employee-auth" element={<EmployeeAuth />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;