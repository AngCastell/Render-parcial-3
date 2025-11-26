const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    port: 5432,
    database: 'crud_db',
    user: 'postgres',
    password: 'postgres',
})

app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const{id} = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        res.json(result.rows[0]);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const{nombre, correo} = req.body;
        const result = await pool.query('INSERT INTO users (nombre, correo) VALUES ($1, $2) RETURNING *', [nombre, correo]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });}
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const{id} = req.params;
        const{nombre, correo} = req.body;
        const result = await pool.query('UPDATE users SET nombre = $1, correo = $2 WHERE id = $3 RETURNING *', [nombre, correo, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const{id} = req.params;
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'Usuario eliminado'});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Función para conectar a la base de datos con reintentos
async function connectDB() {
    let retries = 5;
    while (retries > 0) {
        try {
            await pool.query('SELECT NOW()');
            console.log('Conexión a la base de datos exitosa');
            
            // Crear tabla si no existe
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY, nombre TEXT, correo TEXT
                )`);
            console.log('Tabla users lista');
            return;
        } catch (err) {
            retries--;
            console.log(`Error conectando a la base de datos. Reintentos restantes: ${retries}`);
            if (retries === 0) {
                console.error('No se pudo conectar a la base de datos después de varios intentos');
                throw err;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

// Conectar a la base de datos antes de iniciar el servidor
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Servidor corriendo en el puerto ${port}`);
    });
}).catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
});
    
