/**
 * service.js
 * – Aquí está la lógica para trabajar con los datos. Cada función llama a un procedimiento almacenado.
 * – Usa getPool() para conectarse a la base de datos.
 */

const { getPool, sql } = require('../db/connection');

/**
 * registrarCaso({ descripcion, fiscalAsignado, estado })
 * – Agrega un nuevo caso usando el procedimiento almacenado sp_registrar_caso.
 */
async function registrarCaso({ descripcion, fiscalAsignado, estado }) {
    const pool = await getPool();
    await pool.request()
        .input('descripcion', sql.VarChar(500), descripcion)
        .input('fiscalAsignado', sql.Int, fiscalAsignado)
        .input('estado', sql.VarChar(50), estado)
        .execute('sp_registrar_caso');
    // Si no hay error, el caso se agregó correctamente.
}

/**
 * obtenerCasos(estado)
 * – Obtiene los casos usando el procedimiento almacenado sp_obtener_casos. 
 *   Si no se pasa un estado, devuelve todos los casos.
 */
async function obtenerCasos(estado) {
    const pool = await getPool();
    const request = pool.request();
    if (estado) {
        request.input('estado', sql.VarChar(50), estado);
    }
    const result = await request.execute('sp_obtener_casos');
    return result.recordset; // Devuelve una lista de casos.
}

/**
 * reasignarCaso({ casoId, nuevoFiscal, nuevaFiscalia })
 * – Cambia el fiscal y la fiscalía de un caso usando el procedimiento almacenado sp_asignar_caso.
 */
async function reasignarCaso({ casoId, nuevoFiscal, nuevaFiscalia }) {
    const pool = await getPool();
    await pool.request()
        .input('casoId', sql.Int, casoId)
        .input('nuevoFiscal', sql.Int, nuevoFiscal)
        .input('nuevaFiscalia', sql.Int, nuevaFiscalia)
        .execute('sp_asignar_caso');
}

/**
 * actualizarEstadoCaso({ casoId, nuevoEstado })
 * – Cambia el estado de un caso usando el procedimiento almacenado sp_actualizar_estado.
 */
async function actualizarEstadoCaso({ casoId, nuevoEstado }) {
    const pool = await getPool();
    await pool.request()
        .input('casoId', sql.Int, casoId)
        .input('nuevoEstado', sql.VarChar(50), nuevoEstado)
        .execute('sp_actualizar_estado');
}

/**
 * generarInformeEstadistico()
 * – Genera un informe con estadísticas usando el procedimiento almacenado sp_generar_informe_estadistico.
 */
async function generarInformeEstadistico() {
    const pool = await getPool();
    const result = await pool.request().execute('sp_generar_informe_estadistico');
    return result.recordset; // Devuelve una lista con los datos del informe.
}

/**
 * obtenerFiscalias()
 * Ejecuta sp_obtener_fiscalias y devuelve un array de objetos:
 * [ { FiscalíaID, NombreFiscalía }, … ]
 */
async function obtenerFiscalias() {
    const pool = await getPool();
    const result = await pool.request()
      .execute('sp_obtener_fiscalias');
    return result.recordset; // Array de { FiscalíaID, NombreFiscalía }
  }
  
  /**
   * obtenerFiscales()
   * Ejecuta sp_obtener_fiscales y devuelve un array de objetos:
   * [ { FiscalID, Nombre, FiscalíaID }, … ]
   */
  async function obtenerFiscales() {
    const pool = await getPool();
    const result = await pool.request()
      .execute('sp_obtener_fiscales');
    return result.recordset; // Array de { FiscalID, Nombre, FiscalíaID }
  }

module.exports = {
    registrarCaso,
    obtenerCasos,
    reasignarCaso,
    actualizarEstadoCaso,
    generarInformeEstadistico,
    obtenerFiscalias,
    obtenerFiscales
};