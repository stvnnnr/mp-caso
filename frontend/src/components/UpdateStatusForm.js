// src/components/UpdateStatusForm.js
import React, { useState } from 'react';

/**
 * UpdateStatusForm props:
 *  - onSubmit: función que recibe ({ nuevoEstado })
 *  - casoId: ID del caso
 */
const UpdateStatusForm = ({ onSubmit, casoId }) => {
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!nuevoEstado) {
      setError('Debe seleccionar un estado.');
      return;
    }

    onSubmit(casoId, { nuevoEstado });
    setNuevoEstado('');
  };

  return (
    <div>
      <h2>Actualizar Estado Caso #{casoId}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nuevo Estado:</label>
          <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
            <option value="">-- Seleccione --</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EN_PROCESO">EN_PROCESO</option>
            <option value="RESUELTO">RESUELTO</option>
          </select>
        </div>

        <button type="submit">Actualizar Estado</button>
      </form>
    </div>
  );
};

export default UpdateStatusForm;
