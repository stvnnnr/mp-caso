// src/pages/Home.js
import React from 'react';
import './Home.css';

const Home = () => (
  <div>
    {/* Hero section similar a mp.gob.gt */}
    <section className="hero">
      <div className="hero-content">
        <h1>Sistema de Gestión de Casos</h1>
        <p>Ministerio Público de Guatemala</p>
      </div>
    </section>

    {/* Sección de íconos o tarjetas con enlaces rápidos */}
    <section className="features container">
      <div className="feature-card">
        <h3>Casos</h3>
        <p>Lista de todos los casos registrados y su estado.</p>
      </div>
      <div className="feature-card">
        <h3>Crear Caso</h3>
        <p>Registra un nuevo caso para seguimiento y control.</p>
      </div>
      <div className="feature-card">
        <h3>Estadísticas</h3>
        <p>Visualiza gráficamente el estado de los casos.</p>
      </div>
    </section>
  </div>
);

export default Home;
