const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/guru', require('./routes/guru.route'));
app.use('/api/siswa', require('./routes/siswa.route'));

// Test route
app.get('/', (req, res) => {
    res.send('API Classroom Management berjalan!');
});

// Database connection
db.sequelize.authenticate()
    .then(() => {
        console.log('Sequelize ORM model sudah dapat digunakan');
    })
    .catch((error) => {
        console.error(error.message);
    });

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});

module.exports = app;