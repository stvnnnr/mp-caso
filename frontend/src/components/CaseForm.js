// src/components/CaseForm.js
import React, { useEffect, useState } from 'react';
import dataService from '../services/dataService';

const CaseForm = ({ onSubmit }) => {
  const [fiscalias, setFiscalias] = useState([]);
  const [fiscales, setFiscales] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [fiscaliaSeleccionada, setFiscaliaSeleccionada] = useState('');
  const [fiscalSeleccionado, setFiscalSeleccionado] = useState('');
  const [estado, setEstado] = useState('PENDIENTE');
  const [error, setError] = useState('');

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

  useEffect(() => {
    async function fetchFiscales() {
      try {
        const todos = await dataService.obtenerFiscales();
        if (fiscaliaSeleccionada) {
          const filtrados = todos.filter(
            (f) => f.FiscalíaID === parseInt(fiscaliaSeleccionada, 10)
          );
          setFiscales(filtrados);
        } else {
          setFiscales([]);
        }
      } catch (err) {
        console.error('Error al cargar fiscales:', err);
      }
    }
    fetchFiscales();
  }, [fiscaliaSeleccionada]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!descripcion || !fiscalSeleccionado || !estado) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    onSubmit({
      descripcion,
      fiscalAsignado: parseInt(fiscalSeleccionado, 10),
      estado,
    });

    setDescripcion('');
    setFiscalSeleccionado('');
    setFiscaliaSeleccionada('');
    setEstado('PENDIENTE');
  };

  return (
    <div>
      <h2>Registrar Nuevo Caso</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div>
          <label>Fiscalía:</label>
          <select
            value={fiscaliaSeleccionada}
            onChange={(e) => {
              setFiscaliaSeleccionada(e.target.value);
              setFiscalSeleccionado('');
            }}
          >
            <option value="">-- Seleccione fiscalía --</option>
            {fiscalias.map((f) => (
              <option key={f.FiscalíaID} value={f.FiscalíaID}>
                {f.NombreFiscalía}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Fiscal:</label>
          <select
            value={fiscalSeleccionado}
            onChange={(e) => setFiscalSeleccionado(e.target.value)}
            disabled={!fiscaliaSeleccionada}
          >
            <option value="">-- Seleccione fiscal --</option>
            {fiscales.map((f) => (
              <option key={f.FiscalID} value={f.FiscalID}>
                {f.Nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EN_PROCESO">EN_PROCESO</option>
            <option value="RESUELTO">RESUELTO</option>
          </select>
        </div>

        <button type="submit">Registrar Caso</button>
      </form>
    </div>
  );
};

export default CaseForm;
