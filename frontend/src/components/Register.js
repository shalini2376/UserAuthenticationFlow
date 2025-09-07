import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';


function Register(){
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const navigate = useNavigate();


async function handleSubmit(e){
e.preventDefault();
setMessage('');
try{
const res = await API.post('/api/register', { email, password });
setMessage(res.data.message || 'Registered');
setTimeout(()=> navigate('/login'), 700);
}catch(err){
const msg = err?.response?.data?.error || 'Registration failed';
setMessage(msg);
}
}

    return (
        <div className="h-100 d-flex flex-column justify-content-center align-items-center">
            <h2 className='p-5'>Register</h2>
            <form className="border rounded p-3 w-50 shadow-lg" onSubmit={handleSubmit}>
            <div className="form-group mb-4">
                <label htmlFor="email">Email:</label>
                <input className="form-control" type="email" id="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input className="form-control" type="password" id="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <button type="submit" className="btn btn-primary mt-3">Register</button>
            </div>
            </form>
            {message && (<p className="mt-3">{message}</p>)}
            <p>Already have account? <Link to="/login">Login</Link></p>
        </div>
    )
}

export default Register;