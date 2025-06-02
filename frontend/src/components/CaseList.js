// src/components/CaseList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CaseList recibe props:
 *  - casos: array de objetos { CasoID, Descripcion, FiscalAsignado, Estado, FechaCreacion, FechaActualizacion }
 *  - onFilterChange: función para cambiar filtro de estado
 *  - estadoFiltro: string con el estado mostrado (o vacío para todos)
 */
const CaseList = ({ casos, onFilterChange, estadoFiltro }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Listado de Casos</h2>

      {/* Filtro de estado */}
      <div style={{ marginBottom: '15px' }}>
        <label>Filtrar por estado: </label>
        <select value={estadoFiltro} onChange={e => onFilterChange(e.target.value)}>
          <option value="">Todos</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="EN_PROCESO">EN_PROCESO</option>
          <option value="RESUELTO">RESUELTO</option>
        </select>
      </div>

      {casos.length === 0 ? (
        <p>No hay casos para mostrar.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Fiscal Asignado</th>
              <th>Estado</th>
              <th>Creación</th>
              <th>Última Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {casos.map(caso => (
              <tr key={caso.CasoID}>
                <td>{caso.CasoID}</td>
                <td>{caso.Descripcion}</td>
                <td>{caso.FiscalAsignado}</td>
                <td>{caso.Estado}</td>
                <td>{new Date(caso.FechaCreacion).toLocaleString()}</td>
                <td>{caso.FechaActualizacion ? new Date(caso.FechaActualizacion).toLocaleString() : '-'}</td>
                <td>
                  {/* Botones para navegar a las páginas de reassign / update */}
                  <button
                    onClick={() => navigate(`/cases/${caso.CasoID}/reassign`)}
                    style={{ marginRight: '5px' }}
                  >
                    Reasignar
                  </button>
                  <button onClick={() => navigate(`/cases/${caso.CasoID}/update-status`)}>
                    Actualizar Estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CaseList;
