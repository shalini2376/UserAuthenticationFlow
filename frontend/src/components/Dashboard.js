import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../AuthContext';


export default function Dashboard(){
const { user, setUser, refresh } = useAuth();
const [message, setMessage] = useState('');
const navigate = useNavigate();


async function handleLogout(){
try{
    await API.post('/api/logout');
    setUser(null);
    navigate('/login');
}catch(err){
    setMessage('Logout failed');
}
}


return (
<div className="h-100">
    <h3 className="p-3">Dashboard</h3>
    <p>{user ? `Welcome, ${user.email}` : 'No user data'}</p>
    <div style={{display:'flex',gap:8}}>
    <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
    <button className="btn btn-primary" onClick={refresh}>Refresh</button>
    </div>
    <p style={{color:'red'}}>{message}</p>
</div>
);
}