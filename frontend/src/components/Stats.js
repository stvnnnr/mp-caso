// src/components/Stats.js
import React from 'react';

const Stats = ({ data }) => {
  return (
    <div>
      <h2>Estadísticas de Casos</h2>
      {data.length === 0 ? (
        <p>No hay datos para mostrar.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>{item.Estado}</td>
                <td>{item.Cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Stats;
