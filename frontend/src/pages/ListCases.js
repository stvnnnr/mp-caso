// src/pages/ListCases.js
import React, { useEffect, useState } from 'react';
import caseService from '../services/caseService';
import CaseList from '../components/CaseList';
import Loader from '../components/Loader';

const ListCases = () => {
  const [casos, setCasos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para cargar casos según estadoFiltro
  const fetchCasos = async (estado) => {
    setLoading(true);
    setError('');
    try {
      const lista = await caseService.obtenerCasos(estado);
      setCasos(lista);
    } catch (err) {
      console.error('Error al obtener casos:', err);
      setError('No se pudieron cargar los casos.');
    } finally {
      setLoading(false);
    }
  };

  // Al montar, cargar todos los casos
  useEffect(() => {
    fetchCasos(estadoFiltro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoFiltro]);

  return (
    <div>
      <h1>Lista de Casos</h1>
      {error && <p className="error">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <CaseList
          casos={casos}
          estadoFiltro={estadoFiltro}
          onFilterChange={(estado) => setEstadoFiltro(estado)}
        />
      )}
    </div>
  );
};

export default ListCases;
