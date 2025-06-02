// src/services/dataService.js
import api from './api';

/**
 * Service para datos maestros (fiscalías y fiscales):
 * – obtenerFiscalias(): GET /fiscalias
 * – obtenerFiscales(): GET /fiscales
 */

const dataService = {
  /**
   * Obtiene todas las fiscalías.
   */
  async obtenerFiscalias() {
    const response = await api.get('/fiscalias');
    return response.data; // Array de { FiscalíaID, NombreFiscalía }
  },

  /**
   * Obtiene todos los fiscales.
   */
  async obtenerFiscales() {
    const response = await api.get('/fiscales');
    return response.data; // Array de { FiscalID, Nombre, FiscalíaID }
  }
};

export default dataService;
