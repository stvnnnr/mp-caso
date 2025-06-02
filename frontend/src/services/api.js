// src/services/api.js
import axios from 'axios';

// Crear instancia de Axios con configuración global
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Ajusta si tu backend corre en otro host/puerto
  headers: {
    'Content-Type': 'application/json'
  }
});

// Puedes agregar interceptores si quisieras manejar tokens, logging, etc.
// api.interceptors.request.use(...)

// Exportar la instancia para usar en otros servicios
export default api;
