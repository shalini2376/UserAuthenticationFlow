import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


export default function ProtectedRoute({ children }){
const { user, loading } = useAuth();
if (loading) return <p>Checking auth...</p>;
if (!user) return <Navigate to="/login" replace />;
return children;
}