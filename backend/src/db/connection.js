/**
 * connection.js
 * – Carga las configuraciones desde un archivo .env.
 * – Define los datos de conexión a la base de datos (con valores por defecto si faltan).
 * – Crea y reutiliza una conexión a SQL Server.
 */

const sql = require('mssql');
const dotenv = require('dotenv');
const path = require('path');

// Carga las variables del archivo .env (ubicado dos carpetas arriba)
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configuración de la base de datos (usa valores del .env o valores por defecto)
const dbConfig = {
  user: process.env.DB_USER, // Usuario
  password: process.env.DB_PASSWORD, // Contraseña
  server: process.env.DB_SERVER, // Servidor
  database: process.env.DB_DATABASE, // Base de datos
  port: parseInt(process.env.DB_PORT, 10), // Puerto
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Cifrado (true o false)
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true', // Certificado (true por defecto)
    enableArithAbort: true // Configuración adicional
  }
};

let poolPromise = null;

// Crea o reutiliza la conexión a la base de datos
async function getPool() {
  if (!poolPromise) {
    try {
      poolPromise = await sql.connect(dbConfig); // Crea la conexión
      console.log('Conexión a SQL Server establecida.');
    } catch (err) {
      console.error('Error al conectar a SQL Server:', err);
      throw err; // Lanza el error para manejarlo fuera
    }
  }
  return poolPromise; // Devuelve la conexión
}

// Cierra la conexión a la base de datos
async function closePool() {
  if (poolPromise) {
    try {
      await poolPromise.close(); // Cierra la conexión
      console.log('Conexión cerrada.');
    } catch (err) {
      console.error('Error al cerrar la conexión:', err);
    }
    poolPromise = null; // Resetea la conexión
  }
}

// Exporta las funciones y la librería para usarlas en otros archivos
module.exports = {
  sql,         // Para usar tipos de datos de SQL
  getPool,     // Para obtener la conexión
  closePool    // Para cerrar la conexión
};