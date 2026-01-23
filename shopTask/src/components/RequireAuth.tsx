import { Navigate } from 'react-router-dom';
import React from 'react';

const RequireAuth = ({ children }: { children: React.JSX.Element }) => {
const token = localStorage.getItem('accessToken');
return token ? children : <Navigate to="/login" replace />;
};


export default RequireAuth;