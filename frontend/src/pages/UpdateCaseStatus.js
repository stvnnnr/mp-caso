// src/pages/UpdateCaseStatus.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UpdateStatusForm from '../components/UpdateStatusForm';
import caseService from '../services/caseService';
import Loader from '../components/Loader';

const UpdateCaseStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateStatus = async (casoId, data) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await caseService.actualizarEstado(casoId, data);
      setMessage('Estado actualizado exitosamente.');
      setTimeout(() => {
        navigate('/cases');
      }, 1500);
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      if (err.response && err.response.data && err.response.data.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError('No se pudo actualizar el estado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Actualizar Estado Caso #{id}</h1>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      {loading ? <Loader /> : <UpdateStatusForm onSubmit={handleUpdateStatus} casoId={parseInt(id, 10)} />}
    </div>
  );
};

export default UpdateCaseStatus;
