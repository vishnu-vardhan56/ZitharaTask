const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 4000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Zithara_Task',
    password: '123',
    port: 5432,
});


app.use(cors());
app.use(express.json());

app.get('/api/customer_details', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cust_details');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
