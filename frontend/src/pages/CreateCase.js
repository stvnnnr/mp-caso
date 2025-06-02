// src/pages/CreateCase.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaseForm from '../components/CaseForm';
import caseService from '../services/caseService';
import Loader from '../components/Loader';

const CreateCase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Para mostrar éxito o error
  const [error, setError] = useState('');

  // Función llamada cuando CaseForm hace onSubmit
  const handleCreate = async (data) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await caseService.registrarCaso(data);
      setMessage('Caso creado exitosamente.');
      // Después de unos segundos, redirigir a la lista
      setTimeout(() => {
        navigate('/cases');
      }, 1500);
    } catch (err) {
      console.error('Error al crear caso:', err);
      setError('No se pudo crear el caso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Crear Caso</h1>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      {loading ? <Loader /> : <CaseForm onSubmit={handleCreate} />}
    </div>
  );
};

export default CreateCase;
