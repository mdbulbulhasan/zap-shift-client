import React from 'react';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading/Loading';
import { Navigate } from 'react-router';

const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth();
    // const location = useLocation();
    if (loading) {
        return <Loading></Loading>
    }
    if (!user) {
       return <Navigate to="/login"></Navigate>
    }
    return children;
};

export default PrivateRoute;