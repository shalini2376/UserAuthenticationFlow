require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors')


const {run, get} = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'https://userauthenticationflow.netlify.app',
  credentials: true
}));

const isProd = process.env.NODE_ENV === 'production';

app.use(session({
    secret: process.env.SESSION_SECRET || 'insecure_dev_secret' ,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //1 day
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
    }
}));

// checking 
app.get('/', async (req, res) => {
    res.json(`server is running on ${PORT}`)
})

// check if any user exists in DB
app.get("/api/register-check", async (req, res) => {
  try {
    const user = await get("SELECT id FROM users LIMIT 1");
    if (user) {
      res.json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Register 
app.post('/api/register', async (req, res) => {
    const { email, password} = req.body;
    if ( !email || !password) return res.status(400).json({error: 'Email and password required' });

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        await run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        res.json({message: 'User registered'});
    } catch (err) {
        if (err && err.message && err.message.includes('UNIQUE')) {
            return res.status(400).json({error: 'Email already registered'});
        }
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});

// Login 
app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({error: 'Email and password required'});

    try{
        const user = await get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(400).json({error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({error: 'Invalid credentials'});


        // save user id in session
        req.session.userId = user.id;
        res.json({message: 'Logged in '})
    } catch (err){
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destroy error', err);
            return res.status(500).json({error: 'Could not log out'});
        }
        // clear cookie (default cookie name is connect.sid)
        res.clearCookie('connect.sid');  
        res.json({message: 'Logged out'});
    });
});

// middleware to protect routes
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) return next();
    return res.status(401).json({error: 'Unauthorized' });
}

// protected dashboard
app.get('/api/dashboard', requireAuth, async (req,res) => {
    try {
        const user = await get('SELECT id, email, created_at FROM users WHERE id = ?', [req.session.userId]);
        if (!user) {
            return res.status(401).json({error: 'Unauthorized'});
        }
        res.json({message: `Welcome ${user.email}`, user});
    }catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));


