const sqlite3 = require('sqlite3').verbose();
const path = require("path");

const dbFile = path.join(__dirname, 'user.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) console.error('Failed to open DB:', err);
    else console.log('Connected to sqlite DB:', dbFile);
});

db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

function run(sql, params = []){
    return new Promise((res, rej) => {
        db.run(sql, params, function (err) {
            if(err) rej(err);
            else res(this)  //this.lastID etc
        })
    })
}    

function get(sql, params = []) {
    return new Promise((res, rej) => {
        db.get(sql, params, function (err, row) {
            if(err) rej(err);
            else res(row);
        })
    })
}

function all(sql, params = []){
    return new Promise((resolve,reject) => {
        db.all(sql, params, (err, rows) => {
            if(err) reject(err)
                else resolve(rows);
        })
    })
}

module.exports = {db, run, get, all};