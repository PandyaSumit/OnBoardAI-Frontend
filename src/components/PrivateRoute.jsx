import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const isAuthenticated = localStorage.getItem("accessToken");

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
