const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sam@12345',
    database: 'sample'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Routes
app.get('/users', (req, res) => {
    const { id, name, email, website } = req.query;
    let query = 'SELECT * FROM employees WHERE is_deleted = 0';
    let queryParams = [];

    if (id) {
        query += ' AND id = ?';
        queryParams.push(id);
    }

    if (name) {
        query += ' AND name LIKE ?';
        queryParams.push(`%${name}%`);
    }

    if (email) {
        query += ' AND email LIKE ?';
        queryParams.push(`%${email}%`);
    }

    if (website) {
        query += ' AND website LIKE ?';
        queryParams.push(`%${website}%`);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post('/users', (req, res) => {
    const { name, email, website } = req.body;

    // Validate that required fields are not null
    if (!name || !email || !website) {
        return res.status(400).send({ error: 'Name, email, and website are required fields.' });
    }

    const query = 'INSERT INTO employees (name, email, website) VALUES (?, ?, ?)';
    db.query(query, [name, email, website], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Get the inserted row ID
        const insertedId = result.insertId;

        // Retrieve the inserted data
        db.query('SELECT * FROM employees WHERE id = ?', [insertedId], (err, rows) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.status(201).json(rows[0]);
        });
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, website } = req.body;
    db.query('UPDATE employees SET name = ?, email = ?, website = ? WHERE id = ?', [name, email, website, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id, name, email, website });
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE employees SET is_deleted = 1 WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
