// src/services/caseService.js
import api from './api';

/**
 * Service para Casos:
 * – registrarCaso(data): POST /casos
 * – obtenerCasos(estado): GET /casos?estado=...
 * – reasignarCaso(id, data): PUT /casos/{id}/reasignar
 * – actualizarEstado(id, data): PUT /casos/{id}/estado
 * – obtenerEstadisticas(): GET /casos/informes/estadisticas
 */

const caseService = {
  /**
   * Registra un nuevo caso.
   * @param {{ descripcion: string, fiscalAsignado: number, estado: string }} data
   */
  async registrarCaso(data) {
    const response = await api.post('/casos', data);
    return response.data;
  },

  /**
   * Obtiene todos los casos, o filtra por estado si se provee.
   * @param {string} [estado]  // e.g. "PENDIENTE"
   */
  async obtenerCasos(estado) {
    const url = estado ? `/casos?estado=${estado}` : '/casos';
    const response = await api.get(url);
    return response.data; // Array de casos
  },

  /**
   * Reasigna un caso por su ID.
   * @param {number} casoId
   * @param {{ nuevoFiscal: number, nuevaFiscalia: number }} data
   */
  async reasignarCaso(casoId, data) {
    const response = await api.put(`/casos/${casoId}/reasignar`, data);
    return response.data;
  },

  /**
   * Actualiza el estado de un caso.
   * @param {number} casoId
   * @param {{ nuevoEstado: string }} data
   */
  async actualizarEstado(casoId, data) {
    const response = await api.put(`/casos/${casoId}/estado`, data);
    return response.data;
  },

  /**
   * Genera informe estadístico de casos.
   */
  async obtenerEstadisticas() {
    const response = await api.get('/casos/informes/estadisticas');
    return response.data; // Array de { Estado, Cantidad }
  }
};

export default caseService;
