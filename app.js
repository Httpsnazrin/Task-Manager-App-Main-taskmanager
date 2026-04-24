const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Crucial for reading the login token
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.get('/', (req, res) => res.redirect('/register'));
app.use('/', authRoutes);
app.use('/', taskRoutes);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}`));