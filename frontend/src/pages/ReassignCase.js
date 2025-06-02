// src/pages/ReassignCase.js
import React, { useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReassignForm from '../components/ReassignForm';
import caseService from '../services/caseService';
import Loader from '../components/Loader';

const ReassignCase = () => {
  const { id } = useParams(); // id del caso
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // onSubmit para ReassignForm
  const handleReassign = async (casoId, data) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await caseService.reasignarCaso(casoId, data);
      setMessage('Reasignación exitosa.');
      setTimeout(() => {
        navigate('/cases');
      }, 1500);
    } catch (err) {
      console.error('Error al reasignar caso:', err);
      // Si el backend arroja mensaje de SP, mostrarlo:
      if (err.response && err.response.data && err.response.data.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError('No se pudo reasignar el caso.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Reasignar Caso #{id}</h1>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      {loading ? <Loader /> : <ReassignForm onSubmit={handleReassign} casoId={parseInt(id, 10)} />}
    </div>
  );
};

export default ReassignCase;
