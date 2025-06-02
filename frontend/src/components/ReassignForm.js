// src/components/ReassignForm.js
import React, { useEffect, useState } from 'react';
import dataService from '../services/dataService';

/**
 * ReassignForm props:
 *  - onSubmit: función que recibe ({ nuevoFiscal, nuevaFiscalia })
 *  - casoId: ID del caso a reasignar
 */
const ReassignForm = ({ onSubmit, casoId }) => {
  const [fiscalias, setFiscalias] = useState([]);
  const [fiscales, setFiscales] = useState([]);
  const [nuevaFiscalia, setNuevaFiscalia] = useState('');
  const [nuevoFiscal, setNuevoFiscal] = useState('');
  const [error, setError] = useState('');

  // Cargar fiscalías al montar
  useEffect(() => {
    async function fetchFiscalias() {
      try {
        const list = await dataService.obtenerFiscalias();
        setFiscalias(list);
      } catch (err) {
        console.error('Error al cargar fiscalías:', err);
      }
    }
    fetchFiscalias();
  }, []);

  // Cuando cambie la nueva fiscalía, cargar fiscales de esa fiscalía
  useEffect(() => {
    async function fetchFiscales() {
      try {
        const todos = await dataService.obtenerFiscales();
        if (nuevaFiscalia) {
          const filtrados = todos.filter(f => f.FiscalíaID === parseInt(nuevaFiscalia, 10));
          setFiscales(filtrados);
        } else {
          setFiscales([]);
        }
      } catch (err) {
        console.error('Error al cargar fiscales:', err);
      }
    }
    fetchFiscales();
  }, [nuevaFiscalia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!nuevaFiscalia || !nuevoFiscal) {
      setError('Debe seleccionar fiscalía y fiscal.');
      return;
    }

    onSubmit(casoId, {
      nuevoFiscal: parseInt(nuevoFiscal, 10),
      nuevaFiscalia: parseInt(nuevaFiscalia, 10)
    });
    // Opcional: reset campos
    setNuevaFiscalia('');
    setNuevoFiscal('');
  };

  return (
    <div>
      <h2>Reasignar Caso #{casoId}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nueva Fiscalía:</label>
          <select
            value={nuevaFiscalia}
            onChange={(e) => {
              setNuevaFiscalia(e.target.value);
              setNuevoFiscal('');
            }}
          >
            <option value="">-- Seleccione fiscalía --</option>
            {fiscalias.map(f => (
              <option key={f.FiscalíaID} value={f.FiscalíaID}>
                {f.NombreFiscalía}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Nuevo Fiscal:</label>
          <select
            value={nuevoFiscal}
            onChange={(e) => setNuevoFiscal(e.target.value)}
            disabled={!nuevaFiscalia}
          >
            <option value="">-- Seleccione fiscal --</option>
            {fiscales.map(f => (
              <option key={f.FiscalID} value={f.FiscalID}>
                {f.Nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Reasignar Caso</button>
      </form>
    </div>
  );
};

export default ReassignForm;
