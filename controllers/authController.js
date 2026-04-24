const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'baku_higher_oil_school_2026';

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]);
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: "Email already exists" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.render('login', { error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, users[0].password);
        if (!valid) return res.render('login', { error: 'Invalid credentials' });

        // ID must be in the token payload
        const token = jwt.sign({ id: users[0].id, email: users[0].email }, SECRET, { expiresIn: '2h' });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (err) {
        res.render('login', { error: 'Login error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};