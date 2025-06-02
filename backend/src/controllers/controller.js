/**
 * controller.js
 * – Funciones que manejan las solicitudes de los usuarios,
 *   verifican datos básicos, llaman a los servicios y envían respuestas.
 */

const casosService = require('../services/service');

/**
 * registrarCaso(req, res)
 * – Recibe en req.body: { descripcion, fiscalAsignado, estado }.
 * – Verifica que todos los datos estén presentes.
 * – Llama al servicio para registrar el caso.
 * – Devuelve un mensaje de éxito o un error.
 */
async function registrarCaso(req, res) {
    try {
        const { descripcion, fiscalAsignado, estado } = req.body;

        // Verificar que no falten datos
        if (!descripcion || !fiscalAsignado || !estado) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
        }

        // Llamar al servicio para registrar el caso
        await casosService.registrarCaso({ descripcion, fiscalAsignado, estado });
        return res.status(201).json({ mensaje: 'Caso registrado correctamente.' });
    } catch (error) {
        console.error('Error en registrarCaso:', error);
        return res.status(500).json({ mensaje: 'Error al registrar el caso.' });
    }
}

/**
 * obtenerCasos(req, res)
 * – Recibe opcionalmente en req.query.estado.
 * – Llama al servicio para obtener los casos y devuelve la lista.
 */
async function obtenerCasos(req, res) {
    try {
        const { estado } = req.query; // Puede ser null si no se envía
        const casos = await casosService.obtenerCasos(estado);
        return res.status(200).json(casos);
    } catch (error) {
        console.error('Error en obtenerCasos:', error);
        return res.status(500).json({ mensaje: 'Error al obtener los casos.' });
    }
}

/**
 * reasignarCaso(req, res)
 * – Recibe en req.params.id: casoId.
 * – En req.body: { nuevoFiscal, nuevaFiscalia }.
 * – Llama al servicio para reasignar el caso.
 * – Devuelve un mensaje de éxito o un error.
 */
async function reasignarCaso(req, res) {
    try {
        const casoId = parseInt(req.params.id, 10);
        const { nuevoFiscal, nuevaFiscalia } = req.body;

        if (!nuevoFiscal || !nuevaFiscalia) {
            return res.status(400).json({ mensaje: 'Faltan datos para reasignar.' });
        }

        await casosService.reasignarCaso({ casoId, nuevoFiscal, nuevaFiscalia });
        return res.status(200).json({ mensaje: 'Reasignación procesada correctamente.' });
    } catch (error) {
        console.error('Error en reasignarCaso:', error);
        // Si el servicio lanza un error específico, devolverlo como respuesta
        if (error.message.includes('no está en estado PENDIENTE')) {
            return res.status(400).json({ mensaje: error.message });
        }
        return res.status(500).json({ mensaje: 'Error al reasignar el caso.' });
    }
}

/**
 * actualizarEstadoCaso(req, res)
 * – Recibe en req.params.id: casoId.
 * – En req.body: { nuevoEstado }.
 * – Llama al servicio para actualizar el estado del caso.
 */
async function actualizarEstadoCaso(req, res) {
    try {
        const casoId = parseInt(req.params.id, 10);
        const { nuevoEstado } = req.body;

        if (!nuevoEstado) {
            return res.status(400).json({ mensaje: 'Debe enviar el nuevo estado.' });
        }

        await casosService.actualizarEstadoCaso({ casoId, nuevoEstado });
        return res.status(200).json({ mensaje: 'Estado del caso actualizado.' });
    } catch (error) {
        console.error('Error en actualizarEstadoCaso:', error);
        return res.status(500).json({ mensaje: 'Error al actualizar el estado del caso.' });
    }
}

/**
 * generarInformeEstadistico(req, res)
 * – Llama al servicio para generar un informe y devuelve los datos.
 */
async function generarInformeEstadistico(req, res) {
    try {
        const informe = await casosService.generarInformeEstadistico();
        return res.status(200).json(informe);
    } catch (error) {
        console.error('Error en generarInformeEstadistico:', error);
        return res.status(500).json({ mensaje: 'Error al generar informe estadístico.' });
    }
}

/**
 * obtenerFiscaliasController(req, res)
 * – Llama a casosService.obtenerFiscalias()
 * – Devuelve 200 + array de fiscalías, o 500 en caso de error.
 */
async function obtenerFiscaliasController(req, res) {
    try {
      const listaFiscalias = await casosService.obtenerFiscalias();
      return res.status(200).json(listaFiscalias);
    } catch (error) {
      console.error('Error en obtenerFiscaliasController:', error);
      return res.status(500).json({ mensaje: 'Error al obtener las fiscalías.' });
    }
  }
  
  /**
   * obtenerFiscalesController(req, res)
   * – Llama a casosService.obtenerFiscales()
   * – Devuelve 200 + array de fiscales, o 500 en caso de error.
   */
  async function obtenerFiscalesController(req, res) {
    try {
      const listaFiscales = await casosService.obtenerFiscales();
      return res.status(200).json(listaFiscales);
    } catch (error) {
      console.error('Error en obtenerFiscalesController:', error);
      return res.status(500).json({ mensaje: 'Error al obtener los fiscales.' });
    }
  }

module.exports = {
    registrarCaso,
    obtenerCasos,
    reasignarCaso,
    actualizarEstadoCaso,
    generarInformeEstadistico,
    obtenerFiscaliasController,
    obtenerFiscalesController
};
