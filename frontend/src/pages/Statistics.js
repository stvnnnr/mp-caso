// src/pages/Statistics.js
import React, { useEffect, useState } from 'react';
import caseService from '../services/caseService';
import Stats from '../components/Stats';
import Loader from '../components/Loader';

const Statistics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const stats = await caseService.obtenerEstadisticas();
        setData(stats);
      } catch (err) {
        console.error('Error al obtener estadísticas:', err);
        setError('No se pudieron cargar las estadísticas.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Estadísticas de Casos</h1>
      {error && <p className="error">{error}</p>}
      {loading ? <Loader /> : <Stats data={data} />}
    </div>
  );
};

export default Statistics;
