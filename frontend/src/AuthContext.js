import React, { createContext, useContext, useEffect, useState } from 'react';
import API from './api';

const AuthContext = createContext();
export function useAuth(){ return useContext(AuthContext); }


export function AuthProvider({ children }){
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);


async function fetchUser(){
try{
const res = await API.get('/api/dashboard');
setUser(res.data.user || null);
}catch(err){
setUser(null);
}finally{ setLoading(false); }
}


useEffect(()=>{ fetchUser(); }, []);


const value = { user, setUser, loading, refresh: fetchUser };
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}