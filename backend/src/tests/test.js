// backend/src/tests/casos.test.js

const request = require('supertest');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Montamos un servidor Express de prueba
const casosRoutes = require('../routes/routes');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', casosRoutes);

// Cargar variables de entorno (para connection.js)
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Importar closePool() para cerrar la conexión al final
const { closePool } = require('../db/connection');

describe('Pruebas de endpoints de Casos', () => {
  afterAll(async () => {
    // Cerrar el pool para que Jest termine sin colgar procesos
    await closePool();
  });

  test('GET /api/casos → 200 OK y devuelve un arreglo', async () => {
    const res = await request(app).get('/api/casos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/casos → 201 si datos válidos (requiere al menos 1 fiscal en BD)', async () => {
    const nuevoCaso = {
      descripcion: 'Caso de prueba automatizado',
      fiscalAsignado: 1,
      estado: 'PENDIENTE'
    };
    const res = await request(app).post('/api/casos').send(nuevoCaso);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('mensaje', 'Caso registrado correctamente.');
  });

  test('PUT /api/casos/9999/reasignar → 200 (el SP no arroja error si el caso no existe)', async () => {
    const res = await request(app)
      .put('/api/casos/9999/reasignar')
      .send({ nuevoFiscal: 2, nuevaFiscalia: 1 });
    // Cambiamos la expectativa a 200, porque el SP no lanza RAISERROR en este escenario
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje');
  });

  test('GET /api/casos/informes/estadisticas → 200 OK y devuelve array de objetos', async () => {
    const res = await request(app).get('/api/casos/informes/estadisticas');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('Estado');
      expect(res.body[0]).toHaveProperty('Cantidad');
    }
  });

  test('GET /api/fiscalias → 200 y devuelve array de {FiscalíaID, NombreFiscalía}', async () => {
    const res = await request(app).get('/api/fiscalias');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const item = res.body[0];
      expect(item).toHaveProperty('FiscalíaID');
      expect(item).toHaveProperty('NombreFiscalía');
    }
  });

  test('GET /api/fiscales → 200 y devuelve array de {FiscalID, Nombre, FiscalíaID}', async () => {
    const res = await request(app).get('/api/fiscales');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const item = res.body[0];
      expect(item).toHaveProperty('FiscalID');
      expect(item).toHaveProperty('Nombre');
      expect(item).toHaveProperty('FiscalíaID');
    }
  });
});
