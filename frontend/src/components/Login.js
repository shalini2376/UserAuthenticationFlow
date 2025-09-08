import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../AuthContext';


function Login(){
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const { setUser } = useAuth();
const navigate = useNavigate();


async function handleSubmit(e){
e.preventDefault();
setMessage('');
try{
    await API.post('/api/login', { email, password });
    const dash = await API.get('/api/dashboard');
    setUser(dash.data.user || null);
    navigate('/dashboard');
}catch(err){
    const msg = err?.response?.data?.error || 'Login failed';
    setMessage(msg);
}
}

    return (
        <div className="h-100 d-flex flex-column justify-content-center align-items-center">
            <h2 className='p-5'>Login</h2>
            <form className="border rounded p-3 w-50 shadow-lg" onSubmit={handleSubmit}>
            <div className="form-group mb-4">
                <label htmlFor="email">Email:</label>
                <input value={email} className="form-control" type="email" id="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input value={password} className="form-control" type="password" id="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <button type="submit" className="btn btn-primary mt-3">Login</button>
            </div>
            </form>
            {message && (<p className="mt-3">{message}</p>)}
            <p>Don't have account? <Link to="/register">Register</Link></p>
        </div>
    )
}

export default Login;