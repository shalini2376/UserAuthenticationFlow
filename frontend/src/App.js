import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';


export default function App(){
return (
<AuthProvider>
<Router>
<div style={{maxWidth:800, margin:'24px auto', padding:'0 16px'}}>
<Routes>
<Route path="/" element={<Navigate to="/dashboard" replace />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
</Routes>
</div>
</Router>
</AuthProvider>
);
}