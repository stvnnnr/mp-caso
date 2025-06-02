/**
 * routes.js
 * – Aquí se definen las rutas para trabajar con "casos".
 * – Cada ruta llama a una función que hace el trabajo necesario.
 */

const express = require('express');
const router = express.Router();
const casosController = require('../controllers/controller');

// Ruta para agregar un nuevo caso
router.post('/casos', casosController.registrarCaso);

// Ruta para obtener todos los casos o filtrarlos por estado
router.get('/casos', casosController.obtenerCasos);

// Ruta para reasignar un caso si se cumplen las condiciones
router.put('/casos/:id/reasignar', casosController.reasignarCaso);

// Ruta para cambiar el estado de un caso
router.put('/casos/:id/estado', casosController.actualizarEstadoCaso);

// Ruta para generar un informe con estadísticas
router.get('/casos/informes/estadisticas', casosController.generarInformeEstadistico);

// devuelve todas las fiscalías
router.get('/fiscalias', casosController.obtenerFiscaliasController);

// devuelve todos los fiscales
router.get('/fiscales', casosController.obtenerFiscalesController);

module.exports = router;
