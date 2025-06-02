/**
 * index.js
 * – Archivo principal del servidor.
 * – Configura Express, CORS y el manejo de datos en formato JSON.
 * – Conecta las rutas en /api.
 * – Inicia el servidor en el puerto definido en el archivo .env.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 1. Cargar las configuraciones del archivo .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 4000;

// 2. Configurar herramientas para el servidor
app.use(cors());           // Permitir que otras aplicaciones se conecten al servidor
app.use(express.json());   // Leer datos en formato JSON que llegan al servidor

// 3. Conectar las rutas para manejar "casos"
const casosRoutes = require('./routes/routes');
app.use('/api', casosRoutes);

// 4. Ruta principal para comprobar que el servidor funciona
app.get('/', (req, res) => {
    res.send('API Gestión de Casos - Ministerio Público (Backend) está en funcionamiento.');
});

// 5. Respuesta para rutas que no existen (404)
app.use((req, res) => {
    res.status(404).json({ mensaje: 'La ruta solicitada no existe.' });
});

// 6. Iniciar el servidor y mostrar un mensaje en la consola
app.listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
